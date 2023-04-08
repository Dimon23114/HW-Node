const {
    Types: { ObjectId },
  } = require("mongoose");
  
  const Contact = require("../models/contactModel");
  const { joiSchema, AppError, catchAsync } = require("../utils");
  
  /**
   * Check new contact
   */
  const checkContact = catchAsync(async (req, res, next) => {
    const { error } = joiSchema.validate(req.body);
  
    if (error) {
      return next(new AppError(400, error.details[0].message));
    }
  
    const { email } = req.body;
  
    const contactExists = await Contact.exists({ email });
  
    if (contactExists) {
      return next(new AppError(409, "Contact with this email already exists"));
    }
  
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
  
  module.exports = { checkContact, checkContactId, checkContactUpdate };