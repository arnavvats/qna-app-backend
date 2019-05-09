const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/user");
const Answer = require('../models/answer');
const Question = require('../models/question');
const Topic = require('../models/topic');
router.post('/signup', function(req, res) {
    if (!(req.body.email && req.body.password && req.body.name)) {
        res.status(400).json({success: false, msg: 'Please pass username and password.'});
    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(function(err) {
            if (err) {
                return res.status(400).json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

router.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            delete user.password;
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    const token = jwt.sign(user.toJSON(), config.secret);
                    res.json({success: true, token, user});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

router.get('/topics', async function (req, res) {
    const topics = await Topic.find();
   res.json({topics});
});

router.get('/questions', async function (req, res) {
    const topic_id = req.query.topic_id || null;
    let topic = null;
    let questions = [];

    if (topic_id) {
         topic = await Topic.findById(topic_id);
        questions = await Question.find({topic_ids: topic_id});
    } else {
        questions = await Question.find();
    }
    let responseData = [];
    for(let question of questions) {
        let topics = [];
        for (let topic_id of question.topic_ids) {
            const topic = await Topic.findById(topic_id);
            topics.push(topic);
        }
         responseData.push({
            question,
            topics
        });
    }
   res.json({topic, questions: responseData});
});

router.get('/question/:id', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const question = await Question.findById(req.params.id);
    const user = await User.findById(question.user_id, {password: 0});

    let topics = [];
    for (let topic_id of question.topic_ids) {
        const topic = await Topic.findById(topic_id);
        topics.push(topic);
    }

    let answers = [];
    for (let answer_id of question.answer_ids) {
        const answer = await Answer.findById(answer_id, {password: 0});
         const user = await User.findById(answer.user_id);
         if (answer.status === 'verified' || req.user._id === user._id) {
             answers.push({answer, user});
         }
    }
    res.json({question, answered_by: answers, topics, asked_by: user});
});

router.post('/answers', passport.authenticate('jwt', { session: false}), async function(req, res) {
    const token = getToken(req.headers);
    if (!token) {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
        let answer = new Answer({
            text: req.body.text,
            user_id: req.user._id,
            question_id: req.body.question_id,
        });

        answer = await answer.save();
        const question =  await Question.findOne({_id: req.body.question_id});
        const answer_ids = question.answer_ids.push(answer._id);
        await Question.updateOne({_id: req.body.question_id}, {answer_ids});
        res.json(answer);
});


getToken = function (headers) {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;

