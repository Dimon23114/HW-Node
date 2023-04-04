const joi = require("joi");

const schema = joi.object({
  name: joi.string().min(2).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: joi.number().integer().required(),
  favorite: joi.boolean(),
});

module.exports = schema;