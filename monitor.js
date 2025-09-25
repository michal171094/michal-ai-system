// Keep-Alive Monitor for Michal AI Server
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const CHECK_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

let failureCount = 0;

async function checkServerHealth() {
    try {
        const response = await axios.get(`${SERVER_URL}/api/health`, {
            timeout: 5000
        });
        
        if (response.status === 200) {
            failureCount = 0;
            console.log(`✅ ${new Date().toLocaleTimeString()} - השרת פועל תקין`);
        } else {
            throw new Error(`Server returned status ${response.status}`);
        }
    } catch (error) {
        failureCount++;
        console.log(`🚨 ${new Date().toLocaleTimeString()} - שגיאת שרת (נסיון ${failureCount}/${MAX_RETRIES}):`, error.message);
        
        if (failureCount >= MAX_RETRIES) {
            console.log('🔄 מנסה להפעיל מחדש את השרת...');
            await restartServer();
        }
    }
}

async function restartServer() {
    try {
        // This would need to be implemented based on your deployment
        console.log('🔄 השרת יידרש הפעלה מחדש ידנית');
        failureCount = 0;
    } catch (error) {
        console.log('❌ כישלון בהפעלה מחדש:', error.message);
    }
}

// Start monitoring
console.log('🔍 מתחיל מעקב אחר שרת מיכל AI...');
console.log(`📡 בודק כל ${CHECK_INTERVAL/1000} שניות`);

setInterval(checkServerHealth, CHECK_INTERVAL);

// Initial check
checkServerHealth();