const mongoose = require('mongoose');

const Person = mongoose.model('Person', new mongoose.Schema({
  title: {
    type: String, 
    required: true
  }
}));

module.exports = Person; 