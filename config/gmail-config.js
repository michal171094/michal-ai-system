// Gmail OAuth Configuration
// Set these as environment variables in your deployment platform

const GMAIL_CONFIG = {
  // Default development values - replace with your own development OAuth app
  development: {
    CLIENT_ID: 'your-development-client-id.apps.googleusercontent.com',
    CLIENT_SECRET: 'your-development-client-secret',
    REDIRECT_URI: 'http://localhost:3000/auth/google/callback'
  },
  production: {
    // These will be loaded from environment variables in production
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'https://michal-ai-system.onrender.com/auth/google/callback'
  }
};

const getGmailConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const config = GMAIL_CONFIG[env] || GMAIL_CONFIG.development;
  
  // In development, use the hardcoded values
  // In production, require environment variables
  if (env === 'production' && (!config.CLIENT_ID || !config.CLIENT_SECRET)) {
    console.warn('⚠️ Production Gmail OAuth not configured - set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
    return null;
  }
  
  return config;
};

module.exports = { getGmailConfig };