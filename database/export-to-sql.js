const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const dbPath = process.env.DB_PATH || './database/app.db';
const outputPath = './database/export.sql';

// Helper function to promisify SQLite queries
function queryAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function exportToSQL() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database for export');

      try {
        let sqlContent = '-- SQLite Database Export\n';
        sqlContent += '-- Generated on: ' + new Date().toISOString() + '\n\n';
        
        // Get table schemas
        const tables = await queryAsync(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        
        for (const table of tables) {
          const tableName = table.name;
          console.log(`Exporting table: ${tableName}`);
          
          // Get table schema
          const schema = await queryAsync(db, `PRAGMA table_info(${tableName})`);
          
          // Create CREATE TABLE statement
          sqlContent += `-- Table structure for ${tableName}\n`;
          sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
          sqlContent += `CREATE TABLE \`${tableName}\` (\n`;
          
          const columns = [];
          for (const col of schema) {
            let columnDef = `  \`${col.name}\` ${col.type}`;
            
            if (col.notnull) {
              columnDef += ' NOT NULL';
            }
            
            if (col.pk) {
              columnDef += ' PRIMARY KEY';
              if (col.type.toUpperCase().includes('INTEGER')) {
                columnDef += ' AUTOINCREMENT';
              }
            }
            
            if (col.dflt_value !== null) {
              if (typeof col.dflt_value === 'string' && !col.dflt_value.startsWith('CURRENT_TIMESTAMP')) {
                columnDef += ` DEFAULT '${col.dflt_value}'`;
              } else {
                columnDef += ` DEFAULT ${col.dflt_value}`;
              }
            }
            
            columns.push(columnDef);
          }
          
          sqlContent += columns.join(',\n') + '\n';
          sqlContent += ');\n\n';
          
          // Get table data
          const data = await queryAsync(db, `SELECT * FROM ${tableName}`);
          
          if (data.length > 0) {
            sqlContent += `-- Data for table ${tableName}\n`;
            
            for (const row of data) {
              const columns = Object.keys(row);
              const values = columns.map(col => {
                const value = row[col];
                if (value === null) {
                  return 'NULL';
                } else if (typeof value === 'string') {
                  return `'${value.replace(/'/g, "''")}'`;
                } else {
                  return value;
                }
              });
              
              sqlContent += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${values.join(', ')});\n`;
            }
            sqlContent += '\n';
          }
        }
        
        // Write to file
        fs.writeFileSync(outputPath, sqlContent, 'utf8');
        console.log(`Database exported to: ${outputPath}`);
        
        // Close database connection
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
          } else {
            resolve();
          }
        });

      } catch (error) {
        console.error('Error during export:', error);
        db.close();
        reject(error);
      }
    });
  });
}

exportToSQL().catch(console.error); 