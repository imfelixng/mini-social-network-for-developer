const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';
    data.name = !isEmpty(data.name) ? data.name : '';
    data.avatar = !isEmpty(data.avatar) ? data.avatar : '';

    if(!Validator.isLength(data.text, {min: 10, max: 300})) {
        errors.text = "Post mmust be between 10 and 300 characters";
    }

    if(Validator.isEmpty(data.text)) {
        errors.text = "Text field is required"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}