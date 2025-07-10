const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true,
    },
    password: {
        type: String,
        required: true
    },
    profileImage:{
        type:String,
        default:'',
    },
    createdAt: {
        type:Date,
        default: Date.now
    },
});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}


module.exports = mongoose.model('User', userSchema) 

