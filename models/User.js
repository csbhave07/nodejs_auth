const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: [3, 'Username should not have less than 3 characters'],
        maxLength: [100, 'Username should not have more than 100 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [3, 'Email should not have less than 3 characters'],
        maxLength: [100, 'Email should not have more than 100 characters']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Password should not have less than 3 characters'],
        maxLength: [100, 'Password should not have more than 100 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        trim: true,
        minLength: [3, 'Role should not have less than 3 characters'],
        maxLength: [100, 'Role should not have more than 100 characters'],
        default: 'user'
    },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);