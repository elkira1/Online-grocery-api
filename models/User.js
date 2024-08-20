const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: 
    { 
        type: String, 
        required: true, 
        unique: true
     },
    password: 
    { 
        type: String, 
        required: true 
    },
    email: 
    { type: String, 
        required: true,
         unique: true
     },
     isAdmin: {
        type: Boolean,
        default:false,
    },
    createdAt: 
    { type: Date, 
        default: Date.now
     }
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
