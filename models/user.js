var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
      telefone: {
        type: String,
        require: true
    },
    cep: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    reputation: {
        type: Number,
        require: true
    },
    counttransaction: {
        type: Number,
        require: true
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        return next()
    }
})

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)