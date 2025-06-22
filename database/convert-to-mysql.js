const fs = require('fs');
const path = require('path');

const inputPath = './database/export.sql';
const outputPath = './database/mysql_export.sql';

function convertToMySQL() {
  try {
    // Read the SQLite SQL file
    const sqliteContent = fs.readFileSync(inputPath, 'utf8');
    
    // Add MySQL-specific header and settings
    let mysqlContent = `-- MySQL Database Export (Converted from SQLite)
-- Generated on: ${new Date().toISOString()}
-- 
-- This file contains MySQL-compatible SQL statements converted from SQLite
-- 
-- Usage:
-- 1. Create a MySQL database
-- 2. Run: mysql -u username -p database_name < mysql_export.sql
-- 
-- MySQL Settings:
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

`;

    // Convert the content
    let convertedContent = sqliteContent;
    
    // Convert data types in CREATE TABLE statements
    convertedContent = convertedContent.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'INT AUTO_INCREMENT PRIMARY KEY');
    convertedContent = convertedContent.replace(/INTEGER/g, 'INT');
    convertedContent = convertedContent.replace(/REAL/g, 'DECIMAL(10,2)');
    convertedContent = convertedContent.replace(/TEXT/g, 'VARCHAR(255)');
    convertedContent = convertedContent.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    
    // Add MySQL engine and charset to CREATE TABLE statements
    convertedContent = convertedContent.replace(/\);(\s*-- Data for table)/g, ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;$1');
    
    // Handle the last CREATE TABLE statement (orders table)
    convertedContent = convertedContent.replace(/\);(\s*-- Data for table orders)/g, ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;$1');
    
    // If there's no data section after the last table, handle it
    convertedContent = convertedContent.replace(/\);(\s*-- End of MySQL Export)/g, ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;$1');
    
    // Add the converted content
    mysqlContent += convertedContent;
    
    // Add footer
    mysqlContent += `
-- End of MySQL Export
COMMIT;
`;
    
    // Write the MySQL-compatible SQL file
    fs.writeFileSync(outputPath, mysqlContent, 'utf8');
    
    console.log(`✅ SQLite SQL converted to MySQL format!`);
    console.log(`📁 Input: ${inputPath}`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`\n🔧 Key conversions made:`);
    console.log(`   • INTEGER PRIMARY KEY AUTOINCREMENT → INT AUTO_INCREMENT PRIMARY KEY`);
    console.log(`   • REAL → DECIMAL(10,2)`);
    console.log(`   • TEXT → VARCHAR(255)`);
    console.log(`   • DATETIME → TIMESTAMP`);
    console.log(`   • Added MySQL engine and charset settings`);
    console.log(`   • Added transaction handling`);
    
  } catch (error) {
    console.error('❌ Error converting SQL:', error.message);
  }
}

convertToMySQL(); 