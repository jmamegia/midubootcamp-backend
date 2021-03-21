require('dotenv').config()
const dbString = process.env.DB_STRING_CON
const mongoose = require('mongoose')
const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

mongoose.connect(dbString, dbConfig)
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err))
