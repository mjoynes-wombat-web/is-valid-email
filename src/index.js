// VALID EMAIL
// Attempting to follow rules from https://en.wikipedia.org/wiki/Email_address.
// Checks if the email is valid.
module.exports = (email) => {
  // Need to add support for special local chars that are properly quoted.
  // Need to add support for quotes in ().
  // Checking local section for appropriate characters.
  const localChars = "abcdefghijklmnopqrstuvwxyz0123456789.!#$%&'*+-/=?^_`{|}~ \"".split('');
  const localLetters = email.slice(0, email.indexOf('@')).split('');
  if (localLetters.length > 64) return false;
  const areLocalCharsValid = () => localLetters.every((letter, i) => {
    // Check to make sure " has a period before or after
    // if they are not the first or last character in local.
    if (letter === '"' && i !== 0 && i !== localLetters.length - 1 && (localLetters[i - 1] !== '.' || localLetters[i + 1] !== '.')) return false;
    return localChars.indexOf(letter) !== -1;
  });
  if (!areLocalCharsValid()) return false;

  // Make sure there are not two periods together.
  if (email.indexOf('..') !== -1) return false;

  // Confirm that there is an at symbol and it isn't the first character.
  const atSymbol = email.indexOf('@');
  if (atSymbol < 1) return false;

  // Confirm that there is a dot at least 1 character after the at and 2 characters before the end.
  const dot = email.lastIndexOf('.');
  if (dot <= atSymbol + 1) return false;
  if (dot === email.length - 2) return false;

  // Confirm that there is no spaces that are not surrounded by quotes.
  const space = email.indexOf(' ');
  if (space !== -1 && (email[space + 1] !== '"' || email[space - 1] !== '"')) return false;

  // Confirm that the domain name is only alpha and periods
  const domainChars = 'abcdefghijklmnopqrstuvwxyz.-'.split('');
  const domainLetters = email.slice(email.indexOf('@') + 1).split('');
  const areDomainCharsValid = () => domainLetters.every(
    letter => domainChars.indexOf(letter) !== -1,
  );
  if (!areDomainCharsValid()) return false;

  return true;
};
