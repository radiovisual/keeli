// This validation function is used in the unit tests to simulate a user-supplied
// validation function to the no-malformed-keys.validationFunctionPath option
module.exports = (key) => {
    return false;
}