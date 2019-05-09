var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    user_id: {
        type: String,
    },
    topic_ids: {
        type: [String],
        default: []
    },
    text: {
        type: [String],
        required: true
    },
    answer_ids: {
        type: [String],
        default: []
    }

});

module.exports = mongoose.model('Question', QuestionSchema);
