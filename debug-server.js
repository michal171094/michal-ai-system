// Simple test to verify the fix
console.log('🔍 Server routes debug:');
console.log('📄 Index.html exists:', require('fs').existsSync('./index.html'));
console.log('🌐 Current working directory:', process.cwd());
console.log('📁 Directory contents:', require('fs').readdirSync('.').filter(f => f.endsWith('.html')));

module.exports = { 
    test: true,
    indexExists: require('fs').existsSync('./index.html'),
    workingDir: process.cwd()
};