# Hướng dẫn chuyển Database sang máy khác

## Yêu cầu hệ thống
- Node.js (phiên bản 14.0.0 trở lên)
- MySQL (phiên bản 5.7 trở lên)
- Git (tùy chọn)

## Bước 1: Chuẩn bị trên máy cũ

### 1.1. Tạo bản sao lưu database
```bash
# Mở terminal/command prompt
# Di chuyển vào thư mục dự án
cd đường-dẫn-đến-dự-án

# Tạo bản sao lưu
node backup-database.js backup
```

Sau khi chạy lệnh trên, một file backup sẽ được tạo trong thư mục `backups` với tên dạng: `backup-YYYY-MM-DDTHH-mm-ss-sssZ.sql`

### 1.2. Copy dữ liệu
Copy các thư mục và file sau sang máy mới:
- Thư mục `backups` (chứa file backup database)
- File `backup-database.js`
- File `database.sql` (nếu có)

## Bước 2: Cài đặt trên máy mới

### 2.1. Cài đặt MySQL
1. Tải MySQL từ trang chủ: https://dev.mysql.com/downloads/mysql/
2. Cài đặt MySQL Server
3. Trong quá trình cài đặt:
   - Ghi nhớ username và password bạn đặt
   - Đảm bảo MySQL Server được cài đặt như một Windows Service

### 2.2. Tạo database mới
1. Mở MySQL Command Line Client
2. Đăng nhập với username và password đã tạo
3. Tạo database mới:
```sql
CREATE DATABASE game_website;
```

### 2.3. Cấu hình backup script
1. Mở file `backup-database.js`
2. Cập nhật thông tin trong phần config:
```javascript
const config = {
    host: 'localhost',
    user: 'root', // Thay đổi thành username MySQL của bạn
    password: '...', // Thay đổi thành password MySQL của bạn
    database: 'game_website',
    mysqlPath: 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin' // Thay đổi đường dẫn MySQL trên máy mới
};
```

### 2.4. Khôi phục database
```bash
# Di chuyển vào thư mục dự án
cd đường-dẫn-đến-dự-án

# Liệt kê các file backup
node backup-database.js list

# Khôi phục database (thay tên-file bằng tên file backup thực tế)
node backup-database.js restore tên-file-backup.sql
```

## Bước 3: Kiểm tra

### 3.1. Kiểm tra database
1. Mở MySQL Command Line Client
2. Đăng nhập và chọn database:
```sql
USE game_website;
SHOW TABLES;
```
3. Kiểm tra dữ liệu trong các bảng:
```sql
SELECT * FROM Users;
SELECT * FROM Games;
SELECT * FROM Comments;
```

### 3.2. Kiểm tra website
1. Khởi động server:
```bash
npm start
```
2. Truy cập website
3. Kiểm tra các chức năng:
   - Đăng nhập/đăng ký
   - Xem danh sách game
   - Thêm/sửa/xóa game (với tài khoản admin)
   - Bình luận

## Xử lý lỗi thường gặp

### 1. Lỗi "Access denied"
- Kiểm tra username và password trong file `backup-database.js`
- Đảm bảo user có quyền truy cập database

### 2. Lỗi "Command not found"
- Kiểm tra đường dẫn MySQL trong `mysqlPath`
- Đảm bảo MySQL đã được cài đặt đúng cách

### 3. Lỗi "Database does not exist"
- Kiểm tra tên database trong file `backup-database.js`
- Đảm bảo database đã được tạo

### 4. Lỗi kết nối
- Kiểm tra MySQL service đang chạy
- Kiểm tra port MySQL (mặc định: 3306)
- Kiểm tra firewall

## Liên hệ hỗ trợ
Nếu gặp vấn đề, vui lòng:
1. Kiểm tra log lỗi
2. Chụp ảnh màn hình lỗi
3. Liên hệ admin để được hỗ trợ

## Lưu ý quan trọng
- Luôn tạo bản sao lưu trước khi thực hiện các thay đổi lớn
- Không chia sẻ thông tin đăng nhập database
- Bảo vệ file backup database
- Kiểm tra kỹ dữ liệu sau khi khôi phục 