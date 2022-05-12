const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const roleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  permissions: [{ type: String }],
});

// it is possible to type the field type directly if there are no other options needed
// example--> phone_number: Number,

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
// userSchema.add({
//   name: { type: String, required: true },
// });

// create and export the mongoose model
module.exports = mongoose.model("Role", roleSchema);
