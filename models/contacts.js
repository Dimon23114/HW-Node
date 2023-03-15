const fs = require("fs/promises");
const path = require("path");
const uuid = require("uuid").v4;
const joi = require("joi");

const schema = joi.object({
  name: joi.string().min(2).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: joi.string().required(),
});

const contactsPath = path.resolve(__dirname, "contacts.json");

/**
 * Get contacts list
 */
const listContacts = async (req, res, next) => {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));

    res.status(200).json({
      contacts,
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

/**
 * Get contact by id
 */
const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    const contact = contacts.find((item) => item.id === id);

    res.status(200).json({
      contact,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create contact
 */
const addContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const validation = schema.validate(req.body);

    if (validation.error) {
      return res.status(400).json({
        msg: "missing required name field",
      });
    }

    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));

    const newContact = {
      id: uuid(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    res.status(201).json({
      contact: newContact,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update contact
 */
const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const validation = schema.validate(req.body);

    if (validation.error) {
      return res.status(400).json({
        msg: "missing fields",
      });
    }

    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    const contact = contacts.find((item) => item.id === id);

    if (name) {
      contact.name = name;
    }
    if (email) {
      contact.email = email;
    }
    if (phone) {
      contact.phone = phone;
    }

    const contactIdx = contacts.findIndex((item) => item.id === id);
    contacts[contactIdx] = contact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    res.status(200).json({
      contact,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete contact
 */
const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));

    const updateContactList = contacts.filter((item) => item.id !== id);

    await fs.writeFile(
      contactsPath,
      JSON.stringify(updateContactList, null, 2)
    );

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};