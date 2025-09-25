const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

class GmailService {
    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

        if (!clientId || !clientSecret) {
            throw new Error('Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
        }

        this.tokenPath = path.resolve(__dirname, '../config/gmail-tokens.json');
        this.ensureTokenDirectory();

        this.oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        this.authScopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        this.authenticated = false;
        this.loadTokensFromDisk();
    }

    ensureTokenDirectory() {
        const dir = path.dirname(this.tokenPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    getAuthUrl() {
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: this.authScopes
        });
    }

    async exchangeCodeForTokens(code) {
        const { tokens } = await this.oAuth2Client.getToken(code);
        this.setTokens(tokens);
        return tokens;
    }

    setTokens(tokens) {
        this.oAuth2Client.setCredentials(tokens);
        this.saveTokensToDisk(tokens);
        this.authenticated = true;
    }

    loadTokensFromDisk() {
        try {
            if (fs.existsSync(this.tokenPath)) {
                const raw = fs.readFileSync(this.tokenPath, 'utf8');
                if (!raw) return false;

                const tokens = JSON.parse(raw);
                if (tokens) {
                    this.oAuth2Client.setCredentials(tokens);
                    this.authenticated = true;
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.warn('Failed to load Gmail tokens:', error.message);
            return false;
        }
    }

    saveTokensToDisk(tokens) {
        fs.writeFileSync(this.tokenPath, JSON.stringify(tokens, null, 2), 'utf8');
    }

    hasValidTokens() {
        return this.authenticated;
    }

    async listRecentEmails(maxResults = 10) {
        if (!this.hasValidTokens()) {
            throw new Error('AUTH_REQUIRED');
        }

        try {
            const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });

            const listResponse = await gmail.users.messages.list({
                userId: 'me',
                maxResults,
                q: 'newer_than:7d'
            });

            const messages = listResponse.data.messages || [];
            if (messages.length === 0) {
                return [];
            }

            const emails = [];
            for (const message of messages) {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'full'
                });

                const normalized = this.normalizeEmail(email.data);
                emails.push(normalized);
            }

            return emails;
        } catch (error) {
            if (error && error.code === 401) {
                // Tokens invalid, require re-auth
                this.authenticated = false;
                throw new Error('AUTH_REQUIRED');
            }
            console.error('Gmail API error:', error);
            throw error;
        }
    }

    normalizeEmail(rawEmail) {
        const headers = rawEmail.payload?.headers || [];
        const getHeader = (name) => headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

        const subject = getHeader('Subject');
        const from = getHeader('From');
        const to = getHeader('To');
        const date = getHeader('Date');

        const body = this.extractBody(rawEmail.payload);
        const attachments = this.extractAttachments(rawEmail.payload);

        return {
            id: rawEmail.id,
            threadId: rawEmail.threadId,
            subject,
            from,
            to,
            date,
            snippet: rawEmail.snippet,
            body,
            attachments
        };
    }

    extractBody(payload) {
        if (!payload) return '';

        if (payload.body && payload.body.data) {
            return this.decodeBase64(payload.body.data);
        }

        if (payload.parts && Array.isArray(payload.parts)) {
            for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' && part.body?.data) {
                    return this.decodeBase64(part.body.data);
                }
                if (part.mimeType === 'text/html' && part.body?.data) {
                    // Strip HTML tags
                    const html = this.decodeBase64(part.body.data);
                    return this.stripHtml(html);
                }
                if (part.parts) {
                    const nested = this.extractBody(part);
                    if (nested) return nested;
                }
            }
        }

        return '';
    }

    extractAttachments(payload) {
        if (!payload || !payload.parts) return [];

        const attachments = [];
        const traverse = (parts) => {
            parts.forEach(part => {
                if (part.filename && part.body && part.body.attachmentId) {
                    attachments.push({
                        filename: part.filename,
                        mimeType: part.mimeType,
                        size: part.body.size
                    });
                }
                if (part.parts) {
                    traverse(part.parts);
                }
            });
        };

        traverse(payload.parts);
        return attachments;
    }

    decodeBase64(data) {
        const buff = Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        return buff.toString('utf8');
    }

    stripHtml(html) {
        return html
            .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();
    }
}

module.exports = GmailService;
