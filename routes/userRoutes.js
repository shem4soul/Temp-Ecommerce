const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/showMe", showCurrentUser);
router.post("/updateUser", updateUser);
router.post("/updateUserPassword", updateUserPassword);
router.get("/:id", getSingleUser);  

module.exports = router;

