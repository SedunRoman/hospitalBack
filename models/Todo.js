const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  owner: {type: Types.ObjectId, ref: 'User'}, 
  name_input: {type: String},
  doc_select: {type: String},
  date_input: {type: String},
  text_input: {type: String}
})

module.exports = model('Todo', schema)