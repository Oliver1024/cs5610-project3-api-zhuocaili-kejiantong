const mongoose = require('mongoose');
const UserSchema = require('../schema/user.schema.js')
const UserModel = mongoose.model('User', UserSchema)

function addUser(user) {
    return UserModel.create(user);
}

function getUserByUsername(username) {
    return UserModel.findOne({ username: username }).exec();
}

function getUserByEmail(email) {
    return UserModel.findOne({ email: email }).exec();
}

function findUserAndUpdate(email, data) {
    return UserModel.findOneAndUpdate({ email: email}, data).exec();
}

function getAllUsers() {
    return UserModel.find().exec();
}


module.exports = {
    addUser,
    getUserByUsername,
    getAllUsers,
    getUserByEmail,
    findUserAndUpdate
}