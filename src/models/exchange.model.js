const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExchangeSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    exchangeWith: {
        type: String,
        require: true
    },
    imageFiles: [{
        type: String
    }],
    user:{
        type:String,
        require:true
    },
    contact:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:'active'
    }
    
});

const ExchangeModel = mongoose.model("exchanges", ExchangeSchema);

module.exports = { ExchangeModel };