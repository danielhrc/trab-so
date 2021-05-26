var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require : true,
    },
    itemOwner : {
        type: String,
        require: true,
    },
    imagens: {
        type: [],
        require: true
    },
    description: {
        type: String,
        require: true
    },
    linkedAuction: {
        type: String,
        require: true
    }, 
    historic: {
        type: [],
        require: false
    },
    hightestbidder: {
        type: String,
        require: false
    }, hightestbidderEmail: {
        type: String,
        require: false
    }, 
    categories: {
        type: [],
        require: true
    }, forum: {
        type: []
    }, itemOwnerEmail: {
        type: String
    }
})

module.exports = mongoose.model('Item', itemSchema)