-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS ch_test_db;
CREATE USER IF NOT EXISTS 'ch_test'@'localhost' IDENTIFIED BY 'ch_test_pwd';
GRANT ALL PRIVILEGES ON `ch_test_db`.* TO 'ch_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'ch_test'@'localhost';
FLUSH PRIVILEGES;
