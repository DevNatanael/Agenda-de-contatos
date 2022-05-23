const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descricao: String
})

const HomeMode1 = mongoose.model('Home', HomeSchema);

