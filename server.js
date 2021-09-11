const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');

const app = express();

// Middleware
app.use(express.json());

// DB config

const db = config.get("mongoURI");



// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true  })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log("Mongodb connection error is: ", err));

// Use routes
app.use('/api/items', require('./routes/api/items'));


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));  