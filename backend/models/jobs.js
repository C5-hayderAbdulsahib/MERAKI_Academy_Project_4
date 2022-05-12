const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company_name: { type: String, required: true },
  country: { type: String, required: true },

  job_candidate_ids: [
    { type: mongoose.Schema.Types.ObjectId, ref: "JobCandidate" }, //the ref refer to the other model and not this model it refer to the model that we want to make a relation with
  ],
});

// it is possible to type the field type directly if there are no other options needed
// example--> phone_number: Number,

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
jobSchema.add({
  type: { type: String, required: true },
});

// create and export the mongoose model
module.exports = mongoose.model("Job", jobSchema);
