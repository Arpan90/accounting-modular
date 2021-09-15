const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collections = ['narayan', 'savita', 'arpan', 'sakshi'];

// Create Schema

const ItemSchema = new Schema({

    year:{
        type: String,
        required: true
    },

    entries:[{

        id:{
            type: Number,
            required: true
        },

        date:{
            type: String,
            required: true
        },

        amount:{
            type: Number,
            required: true
        },

        narration:{
            type: String,
            required: true
        },

        direction:{
            type: String,
            required: true
        },

        del:{
            type: Boolean
        }
    }]

    
});

collections.map((element) =>{
    module.exports[element] = mongoose.model(element, ItemSchema, element );
});