const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company_name: { type: String, required: true },
  type: { type: String, required: true },
  country: { type: String, required: true },
});

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
// userSchema.add({
//   role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
// });

// create and export the mongoose model
module.exports = mongoose.model("Job", jobSchema);
