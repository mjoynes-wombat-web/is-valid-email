import { expect } from 'chai'
import { describe, it } from 'mocha'
import EmailValidator from '../src'

const emailValidator = new EmailValidator({
  dns: {
    a: -1,
    ns: -1,
    spf: -1,
    mx: -1,
    port: -1,
  },
})

describe('Check valid emails.', async () => {
  const simpleEmail = 'simple@example.com'
  it(`Simple emails are valid. (${simpleEmail})`, async () =>
    expect(await emailValidator.validate(simpleEmail)).to.equal(true))
  const periodEmail = 'very.common@example.com'
  it(`Emails with periods are valid. (${periodEmail})`, async () =>
    expect(await emailValidator.validate(periodEmail)).to.equal(true))
  const emailWSymbol = 'disposable.style.email.with+symbol@example.com'
  it(`Emails with symbols are valid. (${emailWSymbol})`, async () =>
    expect(await emailValidator.validate(emailWSymbol)).to.equal(true))
  const emailWHyphen = 'other.email-with-hyphen@example.com'
  it(`Emails with hyphens are valid. (${emailWHyphen})`, async () =>
    expect(await emailValidator.validate(emailWHyphen)).to.equal(true))
  const emailWFQD = 'fully-qualified-domain@example.com'
  it(`Emails with fully qualified domains are valid. (${emailWFQD})`, async () =>
    expect(await emailValidator.validate(emailWFQD)).to.equal(true))
  const emailWTag = 'user.name+tag+sorting@example.com'
  it(`Emails with tags and sorting are valid. (${emailWTag})`, async () =>
    expect(await emailValidator.validate(emailWTag)).to.equal(true))
  const emailWSingleLetterLocal = 'x@example.com'
  it(`Emails with a single letter local are valid. (${emailWSingleLetterLocal})`, async () =>
    expect(await emailValidator.validate(emailWSingleLetterLocal)).to.equal(
      true
    ))
  // This scenario has to be extremely rare and is very difficult to setup. Ignoring for now.
  // eslint-disable-next-line max-len, no-useless-escape
  // const unusualButValid = '"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com';
  // it(
  //   `Emails with a very unusual set of characters are valid. (${unusualButValid})`,
  //   () => expect( await emailValidator.validate(unusualButValid)).to.equal(true),
  // );
  const emailWHyphenDomain = 'example-indeed@strange-example.com'
  it(`Emails with a hyphenated domain are valid. (${emailWHyphenDomain})`, async () =>
    expect(await emailValidator.validate(emailWHyphenDomain)).to.equal(true))
  // This scenario would only be valid for a local server environment. Ignoring for now.
  // const emailWTLD = 'admin@mailserver1';
  // it(
  //   `Emails with only a Top Level Domain are valid. (${emailWTLD})`,
  //   () => expect( await emailValidator.validate(emailWTLD)).to.equal(true),
  // );

  const emailWSlash = 'test/test@test.com'
  it(`Emails with slashes are valid. (${emailWSlash})`, async () =>
    expect(await emailValidator.validate(emailWSlash)).to.equal(true))

  // This is allowed for testing purposes but really should be invalid. Maybe check against actual tlds?
  // const emailWExampleDomain = 'example@s.example';
  // it(
  //   `Emails with example domain are valid. (${emailWExampleDomain})`,
  //   () => expect( await emailValidator.validate(emailWExampleDomain)).to.equal(true),
  // );

  const emailWOneLetterDomain = 'example@s.example'
  it(`Emails with one letter domain are valid. (${emailWOneLetterDomain})`, async () =>
    expect(await emailValidator.validate(emailWOneLetterDomain)).to.equal(true))
  const emailWShortTLD = 'admin@test.co'
  it(`Email with short Top Level Domain are valid. (${emailWShortTLD})`, async () =>
    expect(await emailValidator.validate(emailWShortTLD)).to.equal(true))
  const emailWSpaceBetweenQuotes = '" "@example.org'
  it(`Email with space between quotes for username are valid. (${emailWSpaceBetweenQuotes})`, async () =>
    expect(await emailValidator.validate(emailWSpaceBetweenQuotes)).to.equal(
      true
    ))

  const doubleDotBeforeAtWQuote = '"john..doe"@example.com'
  it(`Emails with 2 dots together in the local are valid when in quotes. (${doubleDotBeforeAtWQuote})`, async () =>
    expect(await emailValidator.validate(doubleDotBeforeAtWQuote)).to.equal(
      true
    ))

  const bangifiedHostRoute = 'mailhost!username@example.org'
  it(`Emails with bangified host routes are valid. (${bangifiedHostRoute})`, async () =>
    expect(await emailValidator.validate(bangifiedHostRoute)).to.equal(true))

  const percentEscapedMailRoute = 'user%example.com@example.org'
  it(`Emails with % escaped mail routes are valid. (${percentEscapedMailRoute})`, async () =>
    expect(await emailValidator.validate(percentEscapedMailRoute)).to.equal(
      true
    ))

  const localEndingInNonAlphaNum = 'user-@example.org'
  it(`Emails that end in non-alphanumeric characters that are in the allowed printable characters are valid. (${localEndingInNonAlphaNum})`, async () =>
    expect(await emailValidator.validate(localEndingInNonAlphaNum)).to.equal(
      true
    ))

  const gmailEmail = 'test@gmail.com'
  it(`Gmail emails are valid. (${gmailEmail})`, async () =>
    expect(await emailValidator.validate(gmailEmail)).to.equal(true))

  const uppercasedEmail = 'tesT@example.com'
  const sanitizedUppercasedEmail = emailValidator.sanitize(uppercasedEmail)
  it(`When sanitize lowercase is true then emails should be lowercased. (${uppercasedEmail} - ${sanitizedUppercasedEmail})`, () =>
    expect(sanitizedUppercasedEmail).to.equal('test@example.com'))

  const gmailEmailWPeriods = 'test.testing@gmail.com'
  const sanitizedGmailEmailWPeriods =
    emailValidator.sanitize(gmailEmailWPeriods)
  it(`When sanitize gmail is true then gmail emails should have periods removed from the local section. (${gmailEmailWPeriods} - ${sanitizedGmailEmailWPeriods})`, () =>
    expect(sanitizedGmailEmailWPeriods).to.equal('testtesting@gmail.com'))

  const gmailEmailWComment = 'test+thisisacomment@gmail.com'
  const sanitizedGmailEmailWComment =
    emailValidator.sanitize(gmailEmailWComment)
  it(`When sanitize gmail is true then gmail emails should have comments (+thisisacomment) removed. (${gmailEmailWComment} - ${sanitizedGmailEmailWComment})`, () =>
    expect(sanitizedGmailEmailWComment).to.equal('test@gmail.com'))

  const gmailEmailNeedingSanitization = 'test.testing+thisisacomment@gmail.com'
  const sanitizedGmailEmailNeedingSanitization = emailValidator.sanitize(
    gmailEmailNeedingSanitization
  )
  it(`When sanitize gmail is true then gmail emails should have comments and periods stripped. (${gmailEmailNeedingSanitization} - ${sanitizedGmailEmailNeedingSanitization})`, () =>
    expect(sanitizedGmailEmailNeedingSanitization).to.equal(
      'testtesting@gmail.com'
    ))
})

describe('Check invalid emails.', async () => {
  const emailWOAt = 'Abc.example.com'
  it(`Emails without at symbol are invalid. (${emailWOAt})`, async () =>
    expect(await emailValidator.validate(emailWOAt)).to.equal(false))
  const emailWAtFirst = '@Abc.example.com'
  it(`Emails with the at symbol at the beginning are invalid. (${emailWAtFirst})`, async () =>
    expect(await emailValidator.validate(emailWAtFirst)).to.equal(false))
  const emailWMultiAts = 'A@b@c@example.com'
  it(`Emails with multiple ats are invalid. (${emailWMultiAts})`, async () =>
    expect(await emailValidator.validate(emailWMultiAts)).to.equal(false))
  const emailWUnquotedSpecialChars = 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com'
  it(`Emails with unquoted special chars are invalid. (${emailWUnquotedSpecialChars})`, async () =>
    expect(await emailValidator.validate(emailWUnquotedSpecialChars)).to.equal(
      false
    ))
  const emailWQuoteButNoDots = 'just"not"right@example.com'
  it(`Emails with quotes that are not the only thing but not seperated by dots are invalid. (${emailWQuoteButNoDots})`, async () =>
    expect(await emailValidator.validate(emailWQuoteButNoDots)).to.equal(false))
  const emailWSpacesQuotesBackslashOutsideQuotesNoBackslash =
    'this is"notallowed@example.com'
  it(`Emails with spaces, quotes, and backslashes outside of a quotes and not proceeded by a backslash are invalid. (${emailWSpacesQuotesBackslashOutsideQuotesNoBackslash})`, async () =>
    expect(
      await emailValidator.validate(
        emailWSpacesQuotesBackslashOutsideQuotesNoBackslash
      )
    ).to.equal(false))
  const emailWSpacesQuotesBackslashOutsideQuotes =
    'this still"not\\allowed@example.com'
  it(`Emails with spaces, quotes, and backslashes outside of a quotes are invalid. (${emailWSpacesQuotesBackslashOutsideQuotes})`, async () =>
    expect(
      await emailValidator.validate(emailWSpacesQuotesBackslashOutsideQuotes)
    ).to.equal(false))
  const emailWTooLongLocal =
    '1234567890123456789012345678901234567890123456789012345678901234+x@example.com'
  it(`Emails with more than 64 chars are invalid. (${emailWTooLongLocal})`, async () =>
    expect(await emailValidator.validate(emailWTooLongLocal)).to.equal(false))
  const emailWUnderscoredDomain =
    'i_like_underscore@but_its_not_allowed_in_this_part.example.com'
  it(`Emails with underscores in the domain are invalid. (${emailWUnderscoredDomain})`, async () =>
    expect(await emailValidator.validate(emailWUnderscoredDomain)).to.equal(
      false
    ))
  const emailWIconCharacters = 'QA☕CHOCOLATE☕@test.com'
  it(`Emails with icon characters invalid. (${emailWIconCharacters})`, async () =>
    expect(await emailValidator.validate(emailWIconCharacters)).to.equal(false))
  const emailWODomainPeriod = 'james@google'
  it(`Emails without a period in the domain are invalid. (${emailWODomainPeriod})`, async () =>
    expect(await emailValidator.validate(emailWODomainPeriod)).to.equal(false))
  const emailWPeriodNearEnd = 'james@google.c'
  it(`Emails with periods that are less than 2 chars from the end are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWSpaceButNoQuotes = 'james richards@google.com'
  it(`Emails with spaces but no quotes are invalid. (${emailWSpaceButNoQuotes})`, async () =>
    expect(await emailValidator.validate(emailWSpaceButNoQuotes)).to.equal(
      false
    ))
  const emailWSpaceButOnlyQuoteBefore = 'james" richards@google.com'
  it(`Emails with spaces but only a quote before or after are invlaid. (${emailWSpaceButOnlyQuoteBefore})`, async () =>
    expect(
      await emailValidator.validate(emailWSpaceButOnlyQuoteBefore)
    ).to.equal(false))
  const emailWInvalidDomainChars = 'james@cb$.com'
  it(`Emails with invalid chars in the domain are invalid. (${emailWInvalidDomainChars})`, async () =>
    expect(await emailValidator.validate(emailWInvalidDomainChars)).to.equal(
      false
    ))
  const emailWQuoteButMissingDots = 'just."not"right@example.com'
  it(`Emails with quotes that are not the only thing but are missing some of the dots that should surround quotes are invalid. (${emailWQuoteButMissingDots})`, async () =>
    expect(await emailValidator.validate(emailWQuoteButMissingDots)).to.equal(
      false
    ))
  const doubleDotBeforeAt = 'john..doe@example.com'
  it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAt})`, async () =>
    expect(await emailValidator.validate(doubleDotBeforeAt)).to.equal(false))

  const doubleDotBeforeAtAndOneQuote = '"john..doe@example.com'
  it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAtAndOneQuote})`, async () =>
    expect(
      await emailValidator.validate(doubleDotBeforeAtAndOneQuote)
    ).to.equal(false))
  const doubleDotBeforeAtAndTwoQuotesBeforePeriods = '"john"..doe@example.com'
  it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAtAndTwoQuotesBeforePeriods})`, async () =>
    expect(
      await emailValidator.validate(doubleDotBeforeAtAndTwoQuotesBeforePeriods)
    ).to.equal(false))
  const doubleDotAfterAt = 'john.doe@example..com'
  it(`Emails with 2 dots together after the at are invalid. (${doubleDotAfterAt})`, async () =>
    expect(await emailValidator.validate(doubleDotAfterAt)).to.equal(false))

  const emailValidator2 = new EmailValidator({
    local: {
      doublePeriodsInQuotes: false,
      spacesSurroundedByQuote: false,
    },
    dns: {
      a: -1,
      ns: -1,
      spf: -1,
      mx: -1,
      port: -1,
    },
  })

  const emailWSpaceBetweenQuotes = '" "@example.org'
  it(`Email with space between quotes for username are invalid when local.spacesSurroundedByQuote is false. (${emailWSpaceBetweenQuotes})`, async () =>
    expect(await emailValidator2.validate(emailWSpaceBetweenQuotes)).to.equal(
      false
    ))

  const doubleDotBeforeAtWQuote = '"john..doe"@example.com'
  it(`Emails with 2 dots together in the local are invalid when local.doublePeriodsInQuotes is false. (${doubleDotBeforeAtWQuote})`, async () =>
    expect(await emailValidator2.validate(doubleDotBeforeAtWQuote)).to.equal(
      false
    ))
})

// describe('Check run time for 1000 emails.', async () => {
//   const validEmail = 'test@google.com'
//   const maxTime = 20
//   it(`Valid emails run 1000 times should take less than ${maxTime} milliseconds.`, async () => {
//     const startTime = performance.now()
//     const promises = []
//     for (let i = 0; i < 1000; i += 1) {
//       promises.push(emailValidator.validate(validEmail))
//     }
//     await Promise.all(promises)
//     const endTime = performance.now()

//     return expect(endTime - startTime).to.be.below(maxTime)
//   })
//   const invalidEmail = 'invalid@cb$.com'
//   it(`Invalid emails run 1000 times should take less than ${maxTime} milliseconds.`, async () => {
//     const startTime = performance.now()
//     const promises = []
//     for (let i = 0; i < 1000; i += 1) {
//       promises.push(emailValidator.validate(invalidEmail))
//     }
//     await Promise.all(promises)
//     const endTime = performance.now()

//     return expect(endTime - startTime).to.be.below(maxTime)
//   })
// })
