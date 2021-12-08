const Schema = require('mongoose').Schema;

module.exports = jobSchema = new Schema({
    companyName: String,
    companyWebsite: {
        type: String, default: "",
    },
    title: String,
    jobDescription: String,
    salary: Number,
    location: String,
    contact: String,
    posterEmail: String

}, {
    timestamps: true,
}, { collection: 'users' });
