//require the wanted model from the models folder
const categoriesModel = require("../models/categories");

// this function will create a new category job
const createNewCategory = async (req, res) => {
  try {
    const { name } = req.body;

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

module.exports = { createNewCategory };
