const { Router } = require('express')
const router = Router()
const Todo = require('../models/Todo')

router.post('/add', async (req, res) => {
  try {
    const { name_input, doc_select, date_input, text_input, userId } = req.body
    const todo = await new Todo({
      name_input,
      doc_select,
      date_input,
      text_input,
      owner: userId
    })
    await todo.save()
    res.json(todo)
  } catch (error) {
    console.log(error);
  }
})

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    const todo = await Todo.find({ owner: userId })
    res.json(todo)
  } catch (error) {
    console.log(error)
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({_id: req.params.id})
    res.json(todo)
  } catch (error) {
    console.log(error)
  }
})

router.put('/edit/:id', async (req, res) => {
  console.log(req.body)
  try {
    const { userId } = req.query
    const todo = await Todo.find({ owner: userId })
    Todo.updateOne( {_id: req.params.id}, req.body ).then()
  }  catch (error) {
    console.log(error)
  }
})
module.exports = router