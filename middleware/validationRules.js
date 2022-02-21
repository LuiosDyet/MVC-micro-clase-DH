const { body } = require('express-validator');

module.exports = [body('input').not().isEmpty().trim().escape()];
