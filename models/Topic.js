var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopicSchema = new Schema({
    text: {
        type: String
    }
});

module.exports = mongoose.model('Topic', TopicSchema);
