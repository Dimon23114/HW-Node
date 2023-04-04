const { catchAsync, AppError } = require("../utils");
const Contact = require("../models/contactModel");

/**
 * Get contacts list
 */
const listContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find();

  res.status(200).json({
    contacts,
  });
});

/**
 * Get contact by id
 */
const getContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  res.status(200).json({
    contact,
  });
});

/**
 * Create contact
 */
const addContact = catchAsync(async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;

  const newContact = await Contact.create({
    name,
    email,
    phone,
    favorite,
  });

  res.status(201).json({
    contact: newContact,
  });
});

/**
 * Update contact
 */
const updateContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;

  const updateContactById = await Contact.findByIdAndUpdate(
    id,
    {
      name,
      email,
      phone,
      favorite,
    },
    { new: true }
  );

  res.status(200).json({
    updateContactById,
  });
});

/**
 * Favorite contact
 */
const favoriteContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  const updateContactById = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );

  res.status(200).json({
    updateContactById,
  });
});

/**
 * Delete contact
 */
const removeContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Contact.findByIdAndDelete(id);

  res.sendStatus(200);
});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  favoriteContact,
  removeContact,
};