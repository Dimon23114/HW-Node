const {
  Types: { ObjectId },
} = require("mongoose");

const Contact = require("../models/contactModel");
const { validators, AppError, catchAsync } = require("../utils");

/**
 * Check new contact
 */
const checkContact = catchAsync(async (req, res, next) => {
  const { error, value } = validators.createContactValidator(req.body);

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  const { email } = value;

  const contactExists = await Contact.exists({ email });

  if (contactExists) {
    return next(new AppError(409, "Contact with this email already exists"));
  }

  req.body = value;

  next();
});

/**
 * Check contact update
 */
const checkContactUpdate = catchAsync(async (req, res, next) => {
  const { error, value } = validators.updateContactValidator(req.body);

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  req.body = value;

  next();
});

/**
 * Check contact by id
 */
const checkContactId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return next(new AppError(400, "Invalid user id.."));
  }

  next();
});

module.exports = { checkContact, checkContactUpdate, checkContactId };