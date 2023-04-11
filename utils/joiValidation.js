const joi = require("joi");

const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,112})/;

/**
 * Validate signup user data
 */
exports.signupUserValidator = (data) =>
  joi
    .object()
    .options({ abortEarly: false })
    .keys({
      name: joi.string().min(2).alphanum().required(),
      email: joi.string().email().required(),
      password: joi.string().regex(PASSWD_REGEX).required(),
      subscription: joi.string(),
      // avatarURL: joi.string(),
    })
    .validate(data);

/**
 * Login validator
 */
exports.loginUserValidation = (data) =>
  joi
    .object()
    .options({ abortEarly: false })
    .keys({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(112).required(),
    })
    .validate(data);

/**
 * Validate create contact data
 */
exports.createContactValidator = (data) =>
  joi
    .object()
    .options({ abortEarly: false })
    .keys({
      name: joi.string().min(2).alphanum().required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      phone: joi.number().integer().required(),
      favorite: joi.boolean(),
    })
    .validate(data);

/**
 * Validate update contact data
 */
exports.updateContactValidator = (data) =>
  joi
    .object()
    .options({ abortEarly: false })
    .keys({
      name: joi.string().min(2).alphanum(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      phone: joi.number().integer(),
      favorite: joi.boolean(),
    })
    .validate(data);