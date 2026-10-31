require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const transactionService = require('./TransactionService');
const express = require('express');
const cors = require('cors');

const app = express();
const port = Number(process.env.PORT) || 4000;
const maxDatabaseAttempts = 20;
const retryDelayMs = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

function getTransactionId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function sendServerError(res, message, error) {
    console.error(message, error);
    res.status(500).json({ message });
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/transaction', async (req, res) => {
    const { amount, desc } = req.body;
    const parsedAmount = Number(amount);

    if (amount === '' || amount == null || !Number.isFinite(parsedAmount) ||
        parsedAmount < 0 || parsedAmount > 99999999.99 ||
        typeof desc !== 'string' || desc.length > 100) {
        return res.status(400).json({ message: 'Provide a valid amount and a description of at most 100 characters.' });
    }

    try {
        await transactionService.addTransaction(parsedAmount, desc);
        res.status(201).json({ message: 'added transaction successfully' });
    } catch (error) {
        sendServerError(res, 'Could not add transaction.', error);
    }
});

app.get('/transaction', async (req, res) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.json({ result: transactions });
    } catch (error) {
        sendServerError(res, 'Could not retrieve transactions.', error);
    }
});

app.delete('/transaction', async (req, res) => {
    try {
        await transactionService.deleteAllTransactions();
        res.json({ message: 'Transactions deleted.' });
    } catch (error) {
        sendServerError(res, 'Could not delete transactions.', error);
    }
});

app.get('/transaction/id', async (req, res) => {
    const id = getTransactionId(req.query.id);
    if (!id) {
        return res.status(400).json({ message: 'Provide a valid transaction id.' });
    }

    try {
        const transaction = await transactionService.findTransactionById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        res.json({
            id: transaction.id,
            amount: transaction.amount,
            desc: transaction.description
        });
    } catch (error) {
        sendServerError(res, 'Could not retrieve transaction.', error);
    }
});

app.delete('/transaction/id', async (req, res) => {
    const id = getTransactionId(req.body.id ?? req.query.id);
    if (!id) {
        return res.status(400).json({ message: 'Provide a valid transaction id.' });
    }

    try {
        await transactionService.deleteTransactionById(id);
        res.json({ message: `Transaction ${id} deleted.` });
    } catch (error) {
        sendServerError(res, 'Could not delete transaction.', error);
    }
});

async function start() {
    for (let attempt = 1; attempt <= maxDatabaseAttempts; attempt += 1) {
        try {
            await transactionService.initialize();
            break;
        } catch (error) {
            if (attempt === maxDatabaseAttempts) {
                throw new Error(`Could not initialize the database after ${maxDatabaseAttempts} attempts: ${error.message}`);
            }
            console.log(`Database is not ready (attempt ${attempt}/${maxDatabaseAttempts}); retrying in ${retryDelayMs / 1000} seconds.`);
            await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        }
    }

    const server = app.listen(port, () => {
        console.log(`Backend listening on port ${port}.`);
    });

    const shutdown = () => {
        server.close(async () => {
            try {
                await transactionService.close();
                process.exit(0);
            } catch (error) {
                console.error('Error closing database connections.', error);
                process.exit(1);
            }
        });
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
}

start().catch(error => {
    console.error(error.message);
    process.exit(1);
});
