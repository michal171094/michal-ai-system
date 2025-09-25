#!/usr/bin/env node

/**
 * CLI לניהול מערכת עוזר AI אישית למיכל
 * 
 * השימושים:
 * node cli.js init          - אתחול מערכת חדשה  
 * node cli.js start         - הפעלת השרת
 * node cli.js migrate       - הרצת מיגרציות
 * node cli.js seed          - מילוי נתוני דמו
 * node cli.js user create   - יצירת משתמש חדש
 * node cli.js backup        - גיבוי מסד נתונים
 * node cli.js health        - בדיקת תקינות המערכת
 */

const { Command } = require('commander');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// טעינת משתני סביבה
dotenv.config();

const program = new Command();

program
  .name('michal-ai-cli')
  .description('כלי ניהול מערכת עוזר AI אישית למיכל')
  .version('1.0.0');

// פקודת אתחול מלאה
program
  .command('init')
  .description('אתחול מערכת חדשה (מסד נתונים, תיקיות, משתמש ברירת מחדל)')
  .option('-f, --force', 'אתחול בכפיה גם אם יש נתונים קיימים')
  .action(async (options) => {
    console.log('🚀 מתחיל אתחול מערכת עוזר AI אישית למיכל...\n');
    
    try {
      const { initializeSystem } = require('./scripts/initialize');
      await initializeSystem();
      
      console.log('\n✅ אתחול הושלם בהצלחה!');
      console.log('📱 ניתן עכשיו להפעיל את השרת עם: npm start');
    } catch (error) {
      console.error('❌ שגיאה באתחול:', error.message);
      process.exit(1);
    }
  });

// הפעלת השרת
program
  .command('start')
  .description('הפעלת שרת המערכת')
  .option('-p, --port <number>', 'פורט להפעלה', '3000')
  .option('-e, --env <environment>', 'סביבת הפעלה', 'production')
  .action((options) => {
    console.log(`🚀 מפעיל שרת על פורט ${options.port} בסביבה ${options.env}...\n`);
    
    process.env.PORT = options.port;
    process.env.NODE_ENV = options.env;
    
    require('./server');
  });

// מיגרציות מסד נתונים
program
  .command('migrate')
  .description('הרצת מיגרציות מסד נתונים')
  .action(async () => {
    console.log('🗄️  מריץ מיגרציות מסד נתונים...\n');
    
    try {
      const database = require('./config/database');
      await database.connect();
      await database.migrate();
      
      console.log('✅ מיגרציות הושלמו בהצלחה!');
    } catch (error) {
      console.error('❌ שגיאה במיגרציות:', error.message);
      process.exit(1);
    }
  });

// מילוי נתוני דמו
program
  .command('seed')
  .description('מילוי נתוני דמו במסד הנתונים')
  .action(async () => {
    console.log('🌱 ממלא נתוני דמו...\n');
    
    try {
      const { seedDemoData } = require('./scripts/initialize');
      await seedDemoData();
      
      console.log('✅ נתוני הדמו נוספו בהצלחה!');
    } catch (error) {
      console.error('❌ שגיאה במילוי נתוני דמו:', error.message);
      process.exit(1);
    }
  });

// ניהול משתמשים
const userCommand = program
  .command('user')
  .description('ניהול משתמשים');

userCommand
  .command('create')
  .description('יצירת משתמש חדש')
  .requiredOption('-e, --email <email>', 'כתובת מייל')
  .requiredOption('-n, --name <name>', 'שם מלא')
  .option('-p, --password <password>', 'סיסמה (אם לא מוזנת תתבקש)')
  .option('-r, --role <role>', 'תפקיד', 'user')
  .action(async (options) => {
    const inquirer = require('inquirer');
    const bcrypt = require('bcryptjs');
    const database = require('./config/database');
    
    try {
      let password = options.password;
      
      if (!password) {
        const answers = await inquirer.prompt([
          {
            type: 'password',
            name: 'password',
            message: 'הזן סיסמה למשתמש החדש:',
            mask: '*'
          }
        ]);
        password = answers.password;
      }
      
      if (password.length < 6) {
        throw new Error('סיסמה חייבת להכיל לפחות 6 תווים');
      }
      
      await database.connect();
      
      // בדיקה שהמשתמש לא קיים
      const existingUser = await database.query(
        'SELECT id FROM users WHERE email = $1',
        [options.email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('משתמש עם מייל זה כבר קיים');
      }
      
      // יצירת המשתמש
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const result = await database.query(`
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, full_name, role, created_at
      `, [options.email, hashedPassword, options.name, options.role]);
      
      const user = result.rows[0];
      
      console.log('\n✅ משתמש נוצר בהצלחה!');
      console.log(`📧 מייל: ${user.email}`);
      console.log(`👤 שם: ${user.full_name}`);
      console.log(`🔖 תפקיד: ${user.role}`);
      console.log(`📅 נוצר: ${user.created_at}`);
      
    } catch (error) {
      console.error('❌ שגיאה ביצירת משתמש:', error.message);
      process.exit(1);
    }
  });

userCommand
  .command('list')
  .description('הצגת רשימת משתמשים')
  .action(async () => {
    try {
      const database = require('./config/database');
      await database.connect();
      
      const result = await database.query(`
        SELECT id, email, full_name, role, is_active, created_at, last_login
        FROM users
        ORDER BY created_at DESC
      `);
      
      if (result.rows.length === 0) {
        console.log('🤷‍♀️ לא נמצאו משתמשים במערכת');
        return;
      }
      
      console.log('\n📋 רשימת משתמשים:\n');
      console.table(result.rows.map(user => ({
        ID: user.id.substring(0, 8) + '...',
        מייל: user.email,
        שם: user.full_name,
        תפקיד: user.role,
        פעיל: user.is_active ? '✅' : '❌',
        'נוצר ב': new Date(user.created_at).toLocaleDateString('he-IL'),
        'כניסה אחרונה': user.last_login ? 
          new Date(user.last_login).toLocaleDateString('he-IL') : 'אף פעם'
      })));
      
    } catch (error) {
      console.error('❌ שגיאה בקבלת רשימת משתמשים:', error.message);
      process.exit(1);
    }
  });

// גיבוי מסד נתונים
program
  .command('backup')
  .description('יצירת גיבוי של מסד הנתונים')
  .option('-o, --output <path>', 'נתיב לשמירת הגיבוי', `backup_${Date.now()}.sql`)
  .action(async (options) => {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    console.log('💾 יוצר גיבוי מסד נתונים...\n');
    
    try {
      const databaseUrl = process.env.DATABASE_URL;
      const backupPath = path.resolve(options.output);
      
      const command = `pg_dump "${databaseUrl}" > "${backupPath}"`;
      
      await execAsync(command);
      
      const stats = fs.statSync(backupPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log('✅ גיבוי הושלם בהצלחה!');
      console.log(`📁 נתיב: ${backupPath}`);
      console.log(`📏 גודל: ${fileSizeInMB} MB`);
      
    } catch (error) {
      console.error('❌ שגיאה ביצירת גיבוי:', error.message);
      process.exit(1);
    }
  });

// שחזור מגיבוי
program
  .command('restore')
  .description('שחזור מסד נתונים מגיבוי')
  .requiredOption('-i, --input <path>', 'נתיב לקובץ הגיבוי')
  .option('-f, --force', 'שחזור בכפיה (מחיקת נתונים קיימים)')
  .action(async (options) => {
    const inquirer = require('inquirer');
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    if (!fs.existsSync(options.input)) {
      console.error('❌ קובץ גיבוי לא נמצא:', options.input);
      process.exit(1);
    }
    
    if (!options.force) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: '⚠️  פעולה זו תמחק את כל הנתונים הקיימים. להמשיך?',
          default: false
        }
      ]);
      
      if (!answers.confirm) {
        console.log('ביטול פעולת שחזור');
        return;
      }
    }
    
    console.log('🔄 משחזר מסד נתונים מגיבוי...\n');
    
    try {
      const databaseUrl = process.env.DATABASE_URL;
      const backupPath = path.resolve(options.input);
      
      const command = `psql "${databaseUrl}" < "${backupPath}"`;
      
      await execAsync(command);
      
      console.log('✅ שחזור הושלם בהצלחה!');
      
    } catch (error) {
      console.error('❌ שגיאה בשחזור:', error.message);
      process.exit(1);
    }
  });

// בדיקת תקינות
program
  .command('health')
  .description('בדיקת תקינות המערכת')
  .action(async () => {
    console.log('🏥 בודק תקינות המערכת...\n');
    
    const checks = [];
    
    // בדיקת משתני סביבה
    checks.push(checkEnvironmentVariables());
    
    // בדיקת מסד נתונים
    checks.push(checkDatabase());
    
    // בדיקת OpenAI
    checks.push(checkOpenAI());
    
    // בדיקת תיקיות
    checks.push(checkDirectories());
    
    const results = await Promise.allSettled(checks);
    
    console.log('\n📊 תוצאות בדיקות:\n');
    
    results.forEach((result, index) => {
      const checkNames = ['משתני סביבה', 'מסד נתונים', 'OpenAI', 'תיקיות'];
      const status = result.status === 'fulfilled' && result.value ? '✅' : '❌';
      const message = result.status === 'rejected' ? result.reason : (result.value || 'תקין');
      
      console.log(`${status} ${checkNames[index]}: ${message}`);
    });
  });

async function checkEnvironmentVariables() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'OPENAI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw `משתני סביבה חסרים: ${missing.join(', ')}`;
  }
  
  return 'כל המשתנים מוגדרים';
}

async function checkDatabase() {
  try {
    const database = require('./config/database');
    await database.connect();
    const health = await database.healthCheck();
    
    if (health.status !== 'healthy') {
      throw 'מסד נתונים לא תקין';
    }
    
    return 'חיבור תקין';
  } catch (error) {
    throw `שגיאה בחיבור: ${error.message}`;
  }
}

async function checkOpenAI() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw 'מפתח API חסר';
    }
    
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      throw 'מפתח API לא תקין';
    }
    
    return 'מפתח API מוגדר';
  } catch (error) {
    throw error;
  }
}

async function checkDirectories() {
  const dirs = ['logs', 'uploads', 'generated'];
  const missing = dirs.filter(dir => !fs.existsSync(dir));
  
  if (missing.length > 0) {
    throw `תיקיות חסרות: ${missing.join(', ')}`;
  }
  
  return 'כל התיקיות קיימות';
}

// הצגת לוגים
program
  .command('logs')
  .description('הצגת לוגים אחרונים')
  .option('-n, --lines <number>', 'מספר שורות להצגה', '50')
  .option('-f, --follow', 'מעקב אחר לוגים חיים')
  .option('-e, --errors', 'הצגת שגיאות בלבד')
  .action((options) => {
    const { spawn } = require('child_process');
    
    const logFile = options.errors ? 'logs/errors.log' : 'logs/app.log';
    
    if (!fs.existsSync(logFile)) {
      console.log('📋 קובץ לוג לא נמצא:', logFile);
      return;
    }
    
    const args = [`-n${options.lines}`];
    if (options.follow) {
      args.push('-f');
    }
    args.push(logFile);
    
    console.log(`📋 מציג ${options.lines} שורות אחרונות מ-${logFile}\n`);
    
    const tail = spawn('tail', args, { stdio: 'inherit' });
    
    tail.on('error', (error) => {
      console.error('❌ שגיאה בהצגת לוגים:', error.message);
    });
  });

// טיפול בפקודה לא מוכרת
program.on('command:*', () => {
  console.error('❌ פקודה לא מוכרת. השתמש ב--help לרשימת פקודות זמינות');
  process.exit(1);
});

program.parse(process.argv);

// אם לא הוזנה פקודה, הצג עזרה
if (!process.argv.slice(2).length) {
  program.outputHelp();
}