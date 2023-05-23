const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts
} = require("../controllers/contactControllers");

const { authenticateUser } = require("../middlewares/authentication");

router.get("/", authenticateUser, getAllContacts);
router.post("/", authenticateUser, createContact);
router.get("/search/:search", authenticateUser, searchContacts);
router.get("/:id", authenticateUser, getSingleContact);
router.patch("/:id", authenticateUser, updateContact);
router.delete("/:id", authenticateUser, deleteContact);

module.exports = router;