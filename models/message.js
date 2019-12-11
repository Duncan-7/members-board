const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const MessageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, max: 50 },
    body: { type: String, required: true, max: 300 },
    timestamp: { type: Date, required: true }
  }
)

// UserSchema.virtual('url').get(function () {
//   return 
// })

MessageSchema.virtual('formatted_timestamp').get(function () {
  return moment(this.timestamp).format('D MMM HH:mm')
});

module.exports = mongoose.model('Message', MessageSchema);

