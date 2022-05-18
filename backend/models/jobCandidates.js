const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const jobCandidateSchema = new mongoose.Schema(
  {
    preferred_email: { type: String, required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body_description: { type: String, required: true },
    country: { type: String, required: true },

    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, //the ref refer to the other model and not this model it refer to the model that we want to make a relation with
  },
  { timestamps: {} } //this is how to create a timestamps in mongoose and inside the empty object of it i can change the name of the fields createdAt, updatedAt into anything i like and if i did not put the empty object an error will appear
);

// it is possible to type the field type directly if there are no other options needed
// example--> phone_number: Number,

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
// jobSchema.add({
//   type: { type: String, required: true },
// });

// create and export the mongoose model
module.exports = mongoose.model("JobCandidate", jobCandidateSchema);
