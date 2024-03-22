-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS ch_dev_db;
CREATE USER IF NOT EXISTS 'ch_dev'@'localhost' IDENTIFIED BY 'ch_dev_pwd';
GRANT ALL PRIVILEGES ON `ch_dev_db`.* TO 'ch_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'ch_dev'@'localhost';
FLUSH PRIVILEGES;
