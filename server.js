require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//connect to db
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log("MongoDB connected..."))
.catch(err => console.log(err));
const app = express();



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`application is running on port ${PORT}`);
})