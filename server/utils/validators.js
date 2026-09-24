const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// at least 8 chars, one lowercase, one uppercase, one digit, one special char
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const isValidEmail = (email) => EMAIL_REGEX.test(String(email || '').trim());
const isStrongPassword = (pw) => PASSWORD_REGEX.test(String(pw || ''));

// user typed text goes into a regex for search, so escape the special chars
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { isValidEmail, isStrongPassword, escapeRegex };
