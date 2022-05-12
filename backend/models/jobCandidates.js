const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const jobCandidateSchema = new mongoose.Schema({
  preferred_email: { type: String, required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  body_description: { type: String, required: true },
  country: { type: String, required: true },
});

// it is possible to type the field type directly if there are no other options needed
// example--> phone_number: Number,

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
// jobSchema.add({
//   type: { type: String, required: true },
// });

// create and export the mongoose model
module.exports = mongoose.model("JobCandidate", jobCandidateSchema);
