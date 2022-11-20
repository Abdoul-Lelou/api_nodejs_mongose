const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nom: {
        required: true,
        type: String
    },
    nom: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    },
    prenom: {
        required: true,
        type: String
    },
    adresse: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    }
})

module.exports = mongoose.model('users', dataSchema);