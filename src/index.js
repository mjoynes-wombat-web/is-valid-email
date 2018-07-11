// VALID EMAIL
// Checks if the email is valid.
const validEmail = (email) => {
  // Confirm that there is an at symbol and it isn't the first character.
  const atSymbol = email.indexOf('@');
  if (atSymbol < 1) return false;

  // Confirm that there is a dot at least 1 character after the at and 2 characters before the end.
  const dot = email.lastIndexOf('.');
  if (dot <= atSymbol + 1) return false;
  if (dot === email.length - 2) return false;

  // Confirm that there is no spaces.
  const space = email.indexOf(' ');
  if (space !== -1) return false;

  // Confirm that the domain name is only alpha and periods
  const domainChars = 'abcdefghijklmnopqrstuvwxyz.'.split('');
  const domainLetters = email.slice(email.indexOf('@') + 1).split('');
  const isDomainAlpha = () => domainLetters.every(letter => domainChars.indexOf(letter) > -1);
  if (!isDomainAlpha()) return false;

  return true;
};

export default validEmail;
