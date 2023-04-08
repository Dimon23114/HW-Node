const express = require("express");

const router = express.Router();

const {
  getContacts,
  getContact,
  removeContact,
  addContact,
  favoriteContact,
  updateContact,
} = require("../controllers/contactsController");

const {
  checkContact,
  checkContactUpdate,
  checkContactId,
} = require("../middlewares/contactsMiddleware");

const { protect } = require("../middlewares/authMiddlewares");

router.use(protect);

router.route("/")
  .get(getContacts)
  .post(checkContact, addContact);

router.use("/:id", checkContactId);

router
  .route("/:id")
  .get(checkContactId, getContact)
  .put(checkContactUpdate, updateContact)
  .delete(removeContact);

router.route("/:id/favorite").patch(favoriteContact);

module.exports = router;