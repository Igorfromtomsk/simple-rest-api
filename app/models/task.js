const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const taskSchema   = new Schema({
  name: String,
  isCompleted: false,
});

module.exports = mongoose.model('task', taskSchema);