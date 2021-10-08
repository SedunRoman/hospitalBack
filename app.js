const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/todo', require('./routes/todo.route'))

const start = async() => {

  try {
    const url = "mongodb+srv://RomanS:testserver1@cluster0.350pg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`)
    });
  } catch (err) {
    console.error(err)
  }
}
start()