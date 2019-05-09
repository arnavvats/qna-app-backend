var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnswerSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    question_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'under_review'
    }
});

module.exports = mongoose.model('Answer', AnswerSchema);
