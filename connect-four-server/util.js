const { customAlphabet } = require("nanoid");

// nanoid parameters
const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const LENGTH = 10;

const generateId = customAlphabet(ALPHABET, LENGTH);

module.exports = {
  generateId,
};
