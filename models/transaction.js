var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
   involved: {
       type: String,
       require: true
   },
   negotiator: {
       type: String,
       require: true
   },
   negotiatorEmail:{
       type: String,
       require: true
   },
   involvedEmail: {
       type: String,
       require:true
   },
   note: {
       type: Number,
       require: false
   },
   rated: {
       type: Boolean,
       default: false
   }

})

module.exports = mongoose.model('Transaction', transactionSchema)