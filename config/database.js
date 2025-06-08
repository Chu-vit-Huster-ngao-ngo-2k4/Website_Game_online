const {Sequelize} = require('sequelize'); // giúp làm việc dễ dàng với MySQLMySQL
require("dotenv").config();  // Ẩn thống tin database để không bị lộ khi đẩy lên GitHubGitHub

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql",
      logging: false,
    }
  );
  
  sequelize.authenticate()
    .then(() => console.log(" Kết nối Database thành công"))
    .catch(err => console.error("Lỗi kết nối Database:", err));
  
  module.exports = sequelize;