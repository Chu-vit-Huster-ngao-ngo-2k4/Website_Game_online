# Game Website

Website chơi game trực tuyến với nhiều thể loại game khác nhau.

## Tính năng

- Đăng ký/Đăng nhập tài khoản
- Phân quyền người dùng (User/Admin)
- Quản lý game (thêm/sửa/xóa)
- Bình luận game
- Phân loại game theo thể loại
- Giao diện responsive

## Yêu cầu hệ thống

- Node.js (phiên bản 14.0.0 trở lên)
- MySQL (phiên bản 5.7 trở lên)
- Git (tùy chọn)

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/game-website.git
cd game-website
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình môi trường:
- Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```
- Cập nhật các biến môi trường trong file `.env`:
  ```
  # Database Configuration
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=game_website

  # Server Configuration
  PORT=5000
  NODE_ENV=development

  # JWT Configuration
  JWT_SECRET=your_jwt_secret_key
  JWT_EXPIRES_IN=24h

  # Admin Configuration
  ADMIN_KEY=your_admin_key

  # CORS Configuration
  CORS_ORIGIN=http://localhost:3000
  ```

4. Cấu hình database:
- Tạo database mới trong MySQL với tên `game_website`
- Đảm bảo thông tin database trong file `.env` khớp với cấu hình MySQL của bạn

5. Khởi tạo database:
```bash
node database.sql
```

6. Khởi động server:
```bash
npm start
```

## Database và Backup

### Cấu trúc Database
File `database.sql` chứa cấu trúc cơ sở dữ liệu. Khi chạy lệnh `node database.sql`, các bảng cần thiết sẽ được tạo.

### Backup Database
File backup database không được bao gồm trong repository vì lý do bảo mật. Để có dữ liệu mẫu:

1. Liên hệ admin để lấy file backup
2. Sử dụng script backup-database.js để khôi phục:
```bash
node backup-database.js restore tên-file-backup.sql
```

Xem hướng dẫn chi tiết trong file [DATABASE_MIGRATION_GUIDE.md](DATABASE_MIGRATION_GUIDE.md)

## Cấu trúc thư mục

```
game-website/
├── frontend/           # Frontend code
│   ├── src/           # Source code
│   ├── css/           # Stylesheets
│   └── js/            # JavaScript files
├── backend/           # Backend code
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   └── routes/        # API routes
├── config/            # Configuration files
├── middlewares/       # Custom middlewares
├── .env.example       # Mẫu cấu hình môi trường
└── database.sql       # Database schema
```

## Biến môi trường

| Biến | Mô tả | Giá trị mặc định |
|------|-------|-----------------|
| DB_HOST | Host của database | localhost |
| DB_USER | Username database | root |
| DB_PASSWORD | Password database | - |
| DB_NAME | Tên database | game_website |
| PORT | Port của server | 5000 |
| NODE_ENV | Môi trường | development |
| JWT_SECRET | Khóa bí mật JWT | - |
| JWT_EXPIRES_IN | Thời gian hết hạn JWT | 24h |
| ADMIN_KEY | Khóa đăng ký admin | - |
| CORS_ORIGIN | Origin cho CORS | http://localhost:3000 |

## API Endpoints

### Authentication
- POST `/api/auth/register` - Đăng ký tài khoản
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/register-admin` - Đăng ký tài khoản admin
- GET `/api/auth/profile` - Lấy thông tin người dùng
- POST `/api/auth/change-password` - Đổi mật khẩu

### Games
- GET `/api/games` - Lấy danh sách game
- GET `/api/games/:id` - Lấy thông tin game
- POST `/api/games/add` - Thêm game mới (Admin)
- PUT `/api/games/update/:id` - Cập nhật game (Admin)
- DELETE `/api/games/delete/:id` - Xóa game (Admin)

### Comments
- GET `/api/comments/game/:gameId` - Lấy bình luận của game
- POST `/api/comments/add` - Thêm bình luận
- DELETE `/api/comments/delete/:id` - Xóa bình luận

## Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Liên hệ

Tên của bạn - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Link dự án: [https://github.com/your-username/game-website](https://github.com/your-username/game-website) 