var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var auctionSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    items: {
        type: [],
        require: true
    },
    owner: {
        type: String,
        require: true
    },
    endDate:{
        type: String,
        require: true
    }, 
    description: {
        type: String,
        require: true
    }, emailowner: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Auction', auctionSchema)