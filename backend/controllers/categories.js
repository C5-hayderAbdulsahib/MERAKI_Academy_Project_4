//require the wanted model from the models folder
const categoriesModel = require("../models/categories");

// this function will create a new category job
const createNewCategory = async (req, res) => {
  try {
    //the variable names has to be the same as the names in postman or the destructuring will not work
    const { name } = req.body;

    //creating the new category object
    //the key names inside the object model has to be the same names of the Fields in the DB or an error will occur
    const newCategory = new categoriesModel({
      name, //this is the same as name: name
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category Created",
      category: newCategory,
    });
  } catch (err) {
    //we can reach this error for example if we put an id that does not exist in the user model
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

// this function return all the categories
const getAllCategories = async (req, res) => {
  try {
    const allCategories = await categoriesModel.find({});

    //we add this condition to see if there was created categories or not
    if (allCategories.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No Categories Yet" });
    }

    res.status(200).json({
      success: true,
      message: "All The Categories",
      categories: allCategories,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

// this function return the specified category
const getCategoryById = async (req, res) => {
  try {
    //getting the category name from the query
    const category = req.query.category;

    const jobByCategory = await jobsModel.findOne({ category_id: category }); //if we want to find something from the model using id we should use findById

    //we add this condition to see if there was any created objects or the Schema is empty
    if (!jobByCategory) {
      return res.status(200).json({
        success: false,
        message: "There Is No Jobs For This Category",
      });
    }

    res.status(200).json({
      success: true,
      message: "The Job For The Specified Category",
      job: jobByCategory,
    });

    //if we want to check the error part then change the id of the query to something notfound in the model
  } catch (err) {
    //if the user enter a wrong job id then execute the if part
    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json({
        success: false,
        message: "The Category Is Not Found",
      });

      //only if there is a server error then execute this part
    } else {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    }
  }
};

module.exports = { createNewCategory, getAllCategories, getCategoryById };
