const express = require("express");

const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  favoriteContact,
  updateContact,
} = require("../../controllers/contacts");

const { checkContact, checkContactId } = require("../../middlewares/contacts");

router.route("/").get(listContacts).post(checkContact, addContact);

router
  .route("/:id")
  .get(checkContactId, getContactById)
  .put(checkContactId, updateContact)
  .delete(removeContact);

router.route("/:id/favorite").patch(favoriteContact);

module.exports = router;