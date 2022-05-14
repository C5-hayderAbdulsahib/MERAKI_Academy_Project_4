const mongoose = require("mongoose");

// by initializing a new schema it is possible to create a document that would hold wanted information
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company_name: { type: String, required: true },
    country: { type: String, required: true },
    salary_min: Number,
    salary_max: Number,
    currency: String,

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //the ref refer to the other model and not this model it refer to the model that we want to make a relation with

    inFavorites: [String],

    job_candidate_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobCandidate",
      },
    ], //the ref refer to the other model and not this model it refer to the model that we want to make a relation with

    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },

  { timestamps: {} } //this is how to create a timestamps in mongoose and inside the empty object of it i can change the name of the fields createdAt, updatedAt into anything i like and if i did not put the empty object an error will appear
);

// it is possible to type the field type directly if there are no other options needed
// example--> phone_number: Number,

//this is how to add a field to an already exist schema, note: we can just add the new field in the same way above as if we are creating a new schema
jobSchema.add({
  type: { type: String, required: true },
});

// create and export the mongoose model
module.exports = mongoose.model("Job", jobSchema);
