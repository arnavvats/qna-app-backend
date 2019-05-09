const faker = require('faker');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const Answer = require('../models/answer');
const Question = require('../models/question');
const Topic = require('../models/topic');
const User = require('../models/user');
mongoose.Promise = require('bluebird');
async function seed() {
    await mongoose.connect(config.database, { promiseLibrary: require('bluebird') });
    mongoose.connection.db.dropDatabase();
    console.log('Seeding database');
    let topics = [];
    let users = [];
    let questions = [];
    users.push(await new User({
        name: 'Example User',
        email: 'example@gmail.com',
        password: 'password'
    }).save());

    for(let i = 0; i < 48; i ++) {
        users.push(await new User({
            name: faker.fake("{{name.lastName}} {{name.firstName}}"),
            email: faker.internet.email(),
            password: faker.internet.password()
        }).save());
    }
    console.log('Seeded 50 users');

    for(let i = 0; i < 20; i++) {
        topics.push(await new Topic({
            text: faker.random.word()
        }).save())
    }
    console.log('Seeded 20 topics');

    const randomNumberOfQuestions = Math.floor(20 + 20 * Math.random());
    for(let i = 0; i < randomNumberOfQuestions; i ++) {
        const randomUserIndex = Math.floor((users.length - 1 )* Math.random());
        const user_id = users[randomUserIndex]._id;
        const randomNoOfTopics = Math.floor(4 * Math.random() + 1);
        let topic_ids = [];
        for(let j = 0; j < randomNoOfTopics; j++) {
            const randomTopicIndex = Math.floor((topics.length - 1) * Math.random());
            const randomTopicId = topics[randomTopicIndex]._id;
            if(topic_ids.indexOf(randomTopicId) === -1) {
                topic_ids.push(randomTopicId);
            }
        }
        const text = faker.lorem.sentence();
        questions.push(await new Question({
            user_id,
            topic_ids,
            text
        }).save());
    }
    console.log('Seeded ' + randomNumberOfQuestions + ' questions');

    for(let i = 0; i < questions.length; i++) {
        const question_id = questions[i]._id;
        const randomNumberOfAnswers = Math.floor(5 * Math.random());
        let answers = [];
        for(let j = 0; j < randomNumberOfAnswers; j++) {
            const randomUserIndex = Math.floor(users.length * Math.random());
            const user_id = users[randomUserIndex]._id;
            const text = faker.lorem.sentences();
            const status = Math.floor(Math.random() * 2) ? 'under_review' : 'verified';
            answers.push(await new Answer({
                user_id,
                text,
                question_id,
                status
            }).save());
        }
        await Question.updateOne({_id: question_id}, {answer_ids: answers.map(el => el._id)});
    }
    console.log('Seeded answers to all quuestions');

}
seed().then(res => {
   console.log('Open localhost:4200 and login with email: example@gmail.com and password: password');
   process.exit();
});

