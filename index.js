require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const mongoString = process.env.DATABASE_URL; // "mongodb://localhost:27017" 

mongoose.connect(mongoString);
const database = mongoose.connection;
const app = express();

app.use(express.json());

app.use('/api', routes);


app.get("/",(req,res)=>{
    res.render("index");
})



database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

module.exports = database;