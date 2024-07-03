const express = require('express');
const { router } = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./dbConfig'); 

const port = 3000;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

app.get('/ping', (req, res) => {
    res.send('pong');
});

const Starter = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

Starter();
