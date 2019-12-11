const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true, max: 30 },
    last_name: { type: String, required: true, max: 30 },
    email: { type: String, required: true, max: 50 },
    password: { type: String, required: true },
    member: Boolean,
    admin: Boolean
  }
)

// UserSchema.virtual('url').get(function () {
//   return 
// })

UserSchema.virtual('fullname').get(function () {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model('User', UserSchema);

