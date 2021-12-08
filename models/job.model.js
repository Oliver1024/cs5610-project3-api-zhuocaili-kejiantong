const mongoose = require('mongoose')
const JobSchema = require('../schema/job.schema.js')
const JobModel = mongoose.model('Job', JobSchema)

function addJob(job) {
    return JobModel.create(job);
}

function getJobsByPosterEmail(email) {
    return JobModel.find({ posterEmail: email }).exec();
}

function getFavoritesByUserEmail(email) {
    return JobModel.find({ posterEmail: email }).exec();
}

function getSearchedJobs(job) {
    return JobModel.find(job).exec();
}

function getJobById(id) {
    return JobModel.findById(id).exec();
}

function getJob(job) {
    return JobModel.findOne(job).exec();
}

function getAllJobs() {
    return JobModel.find().exec();
}

function findJobAndUpdate(id, data) {
    return JobModel.findByIdAndUpdate(id, data).exec();
}

function findJobAndDelete(id) {
    return JobModel.findByIdAndDelete(id).exec()
}

module.exports = {
    addJob,
    getJobsByPosterEmail,
    getJobById,
    getFavoritesByUserEmail,
    getSearchedJobs,
    findJobAndUpdate,
    getJob,
    getAllJobs,
    findJobAndDelete
}
