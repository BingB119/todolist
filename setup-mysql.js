const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const mysqlPath = 'D:\\phpstudy_pro\\Extensions\\MySQL8.0.12\\bin\\mysql.exe';

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupDatabase() {
  console.log('🚀 TodoList 数据库设置');
  console.log('========================\n');

  try {
    // 测试MySQL连接
    const username = await question('MySQL用户名 (默认root): ') || 'root';
    const password = await question('MySQL密码: ');

    console.log('\n🔄 正在连接MySQL...');

    // 测试连接
    const testCmd = `"${mysqlPath}" -u ${username} ${password ? `-p${password}` : ''} -e "SELECT VERSION();"`;

    exec(testCmd, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ MySQL连接失败:', error.message);
        console.log('请检查用户名和密码是否正确');
        rl.close();
        return;
      }

      console.log('✅ MySQL连接成功!');
      console.log('\n🔄 正在创建数据库和表...');

      const createDbCmd = `"${mysqlPath}" -u ${username} ${password ? `-p${password}` : ''} -e "
        CREATE DATABASE IF NOT EXISTS todolist;
        USE todolist;
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        SHOW TABLES;
      "`;

      exec(createDbCmd, (error, stdout, stderr) => {
        if (error) {
          console.log('❌ 创建数据库失败:', error.message);
          rl.close();
          return;
        }

        console.log('✅ 数据库创建成功!');
        console.log('\n📋 创建的表:');
        console.log(stdout);

        console.log('\n📝 接下来配置 backend/.env 文件:');
        console.log('DB_HOST=localhost');
        console.log(`DB_USER=${username}`);
        console.log(`DB_PASSWORD=${password}`);
        console.log('DB_NAME=todolist');
        console.log('JWT_SECRET=your_secret_key_here');
        console.log('PORT=3000');

        rl.close();
      });
    });

  } catch (error) {
    console.error('❌ 设置过程中出错:', error);
    rl.close();
  }
}

setupDatabase();