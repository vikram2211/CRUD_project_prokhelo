const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./route/route');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //without this line our response to postman cant be send.

mongoose.connect('mongodb://localhost:27017/crud_database',
    { useNewUrlParser: true }
).then(() => {
    console.log("MongoDB connected sucessfully");
}).catch((error) => { console.log(error); })

app.use('/', route)

app.listen(3000, () => {
    console.log("App running on port", 3000);
});
