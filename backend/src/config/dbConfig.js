const mongoose = require('mongoose');

const dbcConfig = 'mongodb+srv://gabriel:gabriel@cluster0.9c5ei.mongodb.net/trello?retryWrites=true&w=majority&appName=Cluster0'

const connection = mongoose.connect(dbcConfig, {
    userNewUrlPlayer: true,
    useUnifiedTopology: true
});

module.exports = connection;