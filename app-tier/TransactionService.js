const dbConfig = require('./DbConfig');
const mysql = require('mysql2');

const pool = mysql.createPool({
    ...dbConfig,
    connectionLimit: 10,
    waitForConnections: true
});

function query(sql, values = []) {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function initialize() {
    await query(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INT NOT NULL AUTO_INCREMENT,
            amount DECIMAL(10,2) NOT NULL,
            description VARCHAR(100) NOT NULL,
            PRIMARY KEY (id)
        )
    `);
}

function addTransaction(amount, description) {
    return query(
        'INSERT INTO transactions (amount, description) VALUES (?, ?)',
        [amount, description]
    );
}

function getAllTransactions() {
    return query('SELECT id, amount, description FROM transactions ORDER BY id');
}

async function findTransactionById(id) {
    const transactions = await query(
        'SELECT id, amount, description FROM transactions WHERE id = ?',
        [id]
    );
    return transactions[0] || null;
}

function deleteAllTransactions() {
    return query('DELETE FROM transactions');
}

function deleteTransactionById(id) {
    return query('DELETE FROM transactions WHERE id = ?', [id]);
}

function close() {
    return new Promise((resolve, reject) => {
        pool.end(error => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    initialize,
    addTransaction,
    getAllTransactions,
    findTransactionById,
    deleteAllTransactions,
    deleteTransactionById,
    close
};
