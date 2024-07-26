const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./dbConfig'); 
const appRoutes = require('./routes/appRoutes');

const port = 3000;
const app = express();


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', appRoutes)



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
