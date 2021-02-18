require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors())
//app.use(bodyParser.json());

//connect to db
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log("MongoDB connected..."))
.catch(err => console.log(err));

const userRoute = require('./routes/userRouter');


app.use('/user', userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`application is running on port ${PORT}`);
})