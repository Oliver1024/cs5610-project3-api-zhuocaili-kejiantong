const Schema = require('mongoose').Schema;

module.exports = User = new Schema({
    username: String,
    email: String,
    password: String,
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    favorites: [{
        job: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
        },
        status: {
            type: String,
            default: ""
        }
    }
    ]
});
