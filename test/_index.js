import { expect } from 'chai';
import { describe, it } from 'mocha';
import isValidEmail from '../src';

describe('Check valid email.', () => {
  const simpleEmail = 'simple@example.com';
  it(
    `Simple emails are valid. (${simpleEmail})`,
    () => expect(isValidEmail(simpleEmail)).to.equal(true),
  );
  const periodEmail = 'very.common@example.com';
  it(
    `Emails with periods are valid. (${periodEmail})`,
    () => expect(isValidEmail(periodEmail)).to.equal(true),
  );
  const emailWSymbol = 'disposable.style.email.with+symbol@example.com';
  it(
    `Emails with symbols are valid. (${emailWSymbol})`,
    () => expect(isValidEmail(emailWSymbol)).to.equal(true),
  );
  const emailWHyphen = 'other.email-with-hyphen@example.com';
  it(
    `Emails with hyphens are valid. (${emailWHyphen})`,
    () => expect(isValidEmail(emailWHyphen)).to.equal(true),
  );
  const emailWTag = 'user.name+tag+sorting@example.com';
  it(
    `Emails with tags and sorting are valid. (${emailWTag})`,
    () => expect(isValidEmail(emailWTag)).to.equal(true),
  );
  const emailWSingleLetterLocal = 'x@example.com';
  it(
    `Emails with a single letter local are valid. (${emailWSingleLetterLocal})`,
    () => expect(isValidEmail(emailWSingleLetterLocal)).to.equal(true),
  );
  // This scenario has to be extremely rare and is very difficult to setup. Ignoring for now.
  // eslint-disable-next-line max-len, no-useless-escape
  // const unusualButValid = '"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com';
  // it(
  //   `Emails with a very unusual set of characters. (${unusualButValid})`,
  //   () => expect(isValidEmail(unusualButValid)).to.equal(true),
  // );
  const emailWHyphenDomain = 'example-indeed@strange-example.com';
  it(
    `Emails with a hyphenated domain. (${emailWHyphenDomain})`,
    () => expect(isValidEmail(emailWHyphenDomain)).to.equal(true),
  );
  // This scenario would only be valid for a local server environment. Ignoring for now.
  // const emailWTLD = 'admin@mailserver1';
  // it(
  //   `Emails with only a Top Level Domain. (${emailWTLD})`,
  //   () => expect(isValidEmail(emailWTLD)).to.equal(true),
  // );
  const emailWOneLetterDomain = 'example@s.example';
  it(
    `Emails with one letter domain. (${emailWOneLetterDomain})`,
    () => expect(isValidEmail(emailWOneLetterDomain)).to.equal(true),
  );
  const emailWShortTLD = 'admin@test.co';
  it(
    `Email with short Top Level Domain. (${emailWShortTLD})`,
    () => expect(isValidEmail(emailWShortTLD)).to.equal(true),
  );
  const emailWSpaceBetweenQuotes = '" "@example.org';
  it(
    `Email with space between quotes for username. (${emailWSpaceBetweenQuotes})`,
    () => expect(isValidEmail(emailWSpaceBetweenQuotes)).to.equal(true),
  );
});
