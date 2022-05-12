//require the wanted model from the models folder
const rolesModel = require("../models/roles");

// this function will create a new role
const createNewRole = async (req, res) => {
  try {
    const { role, permissions } = req.body;

    const newRole = new rolesModel({
      role, //this is the same as role: role
      permissions,
    });

    await newRole.save();

    res.status(201).json({
      success: true,
      message: "Role Created",
      role: newRole,
    });
  } catch (err) {
    //we can reach this error for example if we put an id that does not exist in the user model
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

module.exports = { createNewRole };
