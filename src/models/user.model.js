const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    contact: {
        type: String,
        require:true
    },
    password: {
        type: String,
        require: true
    },
    toys:[{
        type : mongoose.Schema.Types.ObjectId , 
        ref: 'exchanges'
    }]
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = { UserModel };