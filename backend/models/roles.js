const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const roleSchema = new mongoose.Schema({
  role: { type: String, required: true },
  permissions: [{ type: String }],
});

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
// userSchema.add({
//   role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
// });

// create and export the mongoose model
module.exports = mongoose.model("Role", roleSchema);
