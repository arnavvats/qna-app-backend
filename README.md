**QnA app server**

This is the server for the repository https://github.com/arnavvats/qna-app-frontend

**Installation steps**

**1** Run `npm run start` after cloning to your local repository.

This command essentially runs

`npm install` installs your dependencies

`node ./config/setup.js` Seeds a fake database

`node app.js` Spins up the web server

**The frontend does not have sign up option, your default username and password are:**

```username: example@gmail.com```

```password: password```

The database consists of four different models: Topic, Question, Answer, User.

Topic and Question have many-to-many relationship.
Question and Answer has one-to-one relationship with user.

The user model does not have mapping to questiona nd answers as of now, it can be implemented easily in the future.
