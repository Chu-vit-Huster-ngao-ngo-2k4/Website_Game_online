const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cấu hình database
const config = {
    host: 'localhost',
    user: 'root', 
    password: 'Buibinh1310@#', 
    database: 'game_website',
    // Thêm đường dẫn MySQL
    mysqlPath: 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin' // Thay đổi đường dẫn này theo vị trí cài đặt MySQL của bạn
};

// Tạo thư mục backups nếu chưa tồn tại
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// Hàm backup database
function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);
    
    // Sử dụng đường dẫn đầy đủ cho mysqldump
    const mysqldumpPath = path.join(config.mysqlPath, 'mysqldump.exe');
    const command = `"${mysqldumpPath}" -h ${config.host} -u ${config.user} ${config.password ? `-p${config.password}` : ''} ${config.database} > "${backupFile}"`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Lỗi khi backup:', error);
            return;
        }
        console.log(`Backup thành công! File được lưu tại: ${backupFile}`);
    });
}

// Hàm restore database
function restoreDatabase(backupFile) {
    if (!fs.existsSync(backupFile)) {
        console.error('File backup không tồn tại!');
        return;
    }

    // Sử dụng đường dẫn đầy đủ cho mysql
    const mysqlPath = path.join(config.mysqlPath, 'mysql.exe');
    const command = `"${mysqlPath}" -h ${config.host} -u ${config.user} ${config.password ? `-p${config.password}` : ''} ${config.database} < "${backupFile}"`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Lỗi khi restore:', error);
            return;
        }
        console.log('Restore thành công!');
    });
}

// Hàm liệt kê các file backup
function listBackups() {
    const files = fs.readdirSync(backupDir);
    console.log('Danh sách các file backup:');
    files.forEach(file => {
        const stats = fs.statSync(path.join(backupDir, file));
        console.log(`${file} - ${new Date(stats.mtime).toLocaleString()}`);
    });
}

// Xử lý command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'backup':
        backupDatabase();
        break;
    case 'restore':
        if (!args[1]) {
            console.error('Vui lòng chỉ định file backup!');
            console.log('Cách sử dụng: node backup-database.js restore <tên-file>');
            break;
        }
        restoreDatabase(path.join(backupDir, args[1]));
        break;
    case 'list':
        listBackups();
        break;
    default:
        console.log(`
Cách sử dụng:
- Backup database: node backup-database.js backup
- Restore database: node backup-database.js restore <tên-file>
- Liệt kê backups: node backup-database.js list
        `);
} 