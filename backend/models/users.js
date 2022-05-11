const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  company_name: String, // it is possible to type the field type directly if there are no other options needed
  country: { type: String, required: true },

  phone_number: Number, // it is possible to type the field type directly if there are no other options needed
});

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
// userSchema.add({
//   role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
// });

//now we are going to use a Mongoose middleware(also known as pre hooks) in order to change the email to lowerCase before saving it to the database
// pre executers before the save
userSchema.pre("save", async function () {
  //the reason that we use ES5 because in arrow functions this will always refer to the window
  // `this` refers to the newly created user before saving
  this.email = this.email.toLowerCase();
  // console.log(this.email);
});

// create and export the mongoose model
module.exports = mongoose.model("User", userSchema);
