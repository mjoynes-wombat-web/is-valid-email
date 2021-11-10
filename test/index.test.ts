import { expect } from 'chai'
import { describe, it } from 'mocha'
import { EmailSyntaxValidator, EmailSanitizer } from '../src'

describe('Check sanitizer. | Base config.', async () => {
  const emailSanitizer = new EmailSanitizer()
  const uppercasedEmail = 'tesT@example.com'
  const sanitizedUppercasedEmail = emailSanitizer.sanitize(uppercasedEmail)
  it(`When sanitize lowercase is true then emails should be lowercased. (${uppercasedEmail} - ${sanitizedUppercasedEmail})`, () =>
    expect(sanitizedUppercasedEmail).to.equal('test@example.com'))

  const gmailEmailWPeriods = 'test.testing@gmail.com'
  const sanitizedGmailEmailWPeriods =
    emailSanitizer.sanitize(gmailEmailWPeriods)
  it(`When sanitize gmail is true then gmail emails should have periods removed from the local section. (${gmailEmailWPeriods} - ${sanitizedGmailEmailWPeriods})`, () =>
    expect(sanitizedGmailEmailWPeriods).to.equal('testtesting@gmail.com'))

  const gmailEmailWComment = 'test+thisisacomment@gmail.com'
  const sanitizedGmailEmailWComment =
    emailSanitizer.sanitize(gmailEmailWComment)
  it(`When sanitize gmail is true then gmail emails should have comments (+thisisacomment) removed. (${gmailEmailWComment} - ${sanitizedGmailEmailWComment})`, () =>
    expect(sanitizedGmailEmailWComment).to.equal('test@gmail.com'))

  const gmailEmailNeedingSanitization = 'test.testing+thisisacomment@gmail.com'
  const sanitizedGmailEmailNeedingSanitization = emailSanitizer.sanitize(
    gmailEmailNeedingSanitization
  )
  it(`When sanitize gmail is true then gmail emails should have comments and periods stripped. (${gmailEmailNeedingSanitization} - ${sanitizedGmailEmailNeedingSanitization})`, () =>
    expect(sanitizedGmailEmailNeedingSanitization).to.equal(
      'testtesting@gmail.com'
    ))
})

describe('Check sanitizer. | Lowercase false.', async () => {
  const emailSanitizer = new EmailSanitizer({
    lowercase: false,
  })
  const uppercasedEmail = 'tesT@example.com'
  const sanitizedUppercasedEmail = emailSanitizer.sanitize(uppercasedEmail)
  it(`When sanitize lowercase is false then emails should be left with their casing. (${uppercasedEmail} - ${sanitizedUppercasedEmail})`, () =>
    expect(sanitizedUppercasedEmail).to.equal('tesT@example.com'))

  const gmailEmailWPeriods = 'test.testing@gmail.com'
  const sanitizedGmailEmailWPeriods =
    emailSanitizer.sanitize(gmailEmailWPeriods)
  it(`When sanitize gmail is true then gmail emails should have periods removed from the local section. (${gmailEmailWPeriods} - ${sanitizedGmailEmailWPeriods})`, () =>
    expect(sanitizedGmailEmailWPeriods).to.equal('testtesting@gmail.com'))

  const gmailEmailWComment = 'test+thisisacomment@gmail.com'
  const sanitizedGmailEmailWComment =
    emailSanitizer.sanitize(gmailEmailWComment)
  it(`When sanitize gmail is true then gmail emails should have comments (+thisisacomment) removed. (${gmailEmailWComment} - ${sanitizedGmailEmailWComment})`, () =>
    expect(sanitizedGmailEmailWComment).to.equal('test@gmail.com'))

  const gmailEmailNeedingSanitization = 'test.testing+thisisacomment@gmail.com'
  const sanitizedGmailEmailNeedingSanitization = emailSanitizer.sanitize(
    gmailEmailNeedingSanitization
  )
  it(`When sanitize gmail is true then gmail emails should have comments and periods stripped. (${gmailEmailNeedingSanitization} - ${sanitizedGmailEmailNeedingSanitization})`, () =>
    expect(sanitizedGmailEmailNeedingSanitization).to.equal(
      'testtesting@gmail.com'
    ))
})

describe('Check sanitizer. | Gmail false.', async () => {
  const emailSanitizer = new EmailSanitizer({
    gmail: false,
  })
  const uppercasedEmail = 'tesT@example.com'
  const sanitizedUppercasedEmail = emailSanitizer.sanitize(uppercasedEmail)
  it(`When sanitize lowercase is true then emails should be lowercased. (${uppercasedEmail} - ${sanitizedUppercasedEmail})`, () =>
    expect(sanitizedUppercasedEmail).to.equal('test@example.com'))

  const gmailEmailWPeriods = 'test.testing@gmail.com'
  const sanitizedGmailEmailWPeriods =
    emailSanitizer.sanitize(gmailEmailWPeriods)
  it(`When sanitize gmail is true then gmail emails should retain their periods. (${gmailEmailWPeriods} - ${sanitizedGmailEmailWPeriods})`, () =>
    expect(sanitizedGmailEmailWPeriods).to.equal('test.testing@gmail.com'))

  const gmailEmailWComment = 'test+thisisacomment@gmail.com'
  const sanitizedGmailEmailWComment =
    emailSanitizer.sanitize(gmailEmailWComment)
  it(`When sanitize gmail is true then gmail emails should retain their comments. (${gmailEmailWComment} - ${sanitizedGmailEmailWComment})`, () =>
    expect(sanitizedGmailEmailWComment).to.equal(
      'test+thisisacomment@gmail.com'
    ))

  const gmailEmailNeedingSanitization = 'test.testing+thisisacomment@gmail.com'
  const sanitizedGmailEmailNeedingSanitization = emailSanitizer.sanitize(
    gmailEmailNeedingSanitization
  )
  it(`When sanitize gmail is true then gmail emails should retain their comments and periods. (${gmailEmailNeedingSanitization} - ${sanitizedGmailEmailNeedingSanitization})`, () =>
    expect(sanitizedGmailEmailNeedingSanitization).to.equal(
      'test.testing+thisisacomment@gmail.com'
    ))
})

describe('Check valid emails. | Base config.', async () => {
  const emailValidator = new EmailSyntaxValidator()

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

  const emailWInternalQuoteWDots = 'just."not".right@example.com'
  it(`Emails with quotes that are surrounded by periods are valid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
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
})

describe('Check invalid emails. | Base config.', async () => {
  const emailValidator = new EmailSyntaxValidator()

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
  it(`Emails with periods that are less than 2 chars from the end of the domain are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are invalid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      false
    ))
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
  const emailWInternalQuoteWDots = 'just."not."right@example.com'
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))
})

describe('Check valid emails. | W/Out double periods, and spaces surrounded by quotes.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      doublePeriodsInQuotes: false,
      spacesSurroundedByQuote: false,
    },
  })

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

  const emailWShortTLD = 'admin@test.co'
  it(`Email with short Top Level Domain are valid. (${emailWShortTLD})`, async () =>
    expect(await emailValidator.validate(emailWShortTLD)).to.equal(true))

  const emailWInternalQuoteWDots = 'just."not".right@example.com'
  it(`Emails with quotes that are surrounded by periods are valid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
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
})

describe('Check invalid emails. | W/Out double periods, and spaces surrounded by quotes.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      doublePeriodsInQuotes: false,
      spacesSurroundedByQuote: false,
    },
  })

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
  it(`Emails with periods that are less than 2 chars from the end of the domain are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are invalid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      false
    ))
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

  const emailWSpaceBetweenQuotes = '" "@example.org'
  it(`Email with space between quotes for username are invalid when local.spacesSurroundedByQuote is false. (${emailWSpaceBetweenQuotes})`, async () =>
    expect(await emailValidator.validate(emailWSpaceBetweenQuotes)).to.equal(
      false
    ))

  const doubleDotBeforeAtWQuote = '"john..doe"@example.com'
  it(`Emails with 2 dots together in the local are invalid when local.doublePeriodsInQuotes is false. (${doubleDotBeforeAtWQuote})`, async () =>
    expect(await emailValidator.validate(doubleDotBeforeAtWQuote)).to.equal(
      false
    ))

  const emailWInternalQuoteWDots = 'just."not."right@example.com'
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))
})

describe('Check valid emails. | W/Out uppercase letters, and lowercasing.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      alphaUpper: false,
    },
  })

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

  const emailWInternalQuoteWDots = 'just."not".right@example.com'
  it(`Emails with quotes that are surrounded by periods are valid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
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
})

describe('Check invalid emails. | W/Out uppercase letters, and lowercasing.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      alphaUpper: false,
    },
  })

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
  it(`Emails with periods that are less than 2 chars from the end of the domain are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are invalid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      false
    ))
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

  const uppercasedEmail = 'tesT@example.com'
  it(`Emails with uppercase letters when sanitize.lowercase is false and local.alphaUpper is false are invalid. (${uppercasedEmail})`, async () =>
    expect(await emailValidator.validate(uppercasedEmail)).to.equal(false))

  const emailWInternalQuoteWDots = 'just."not."right@example.com'
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))
})

describe('Check valid emails. | W/Out lowercase letters and lowercasing.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      alphaLower: false,
    },
  })

  const simpleEmail = 'simple@example.com'.toUpperCase()
  it(`Simple emails are valid. (${simpleEmail})`, async () =>
    expect(await emailValidator.validate(simpleEmail)).to.equal(true))
  const periodEmail = 'very.common@example.com'.toUpperCase()
  it(`Emails with periods are valid. (${periodEmail})`, async () =>
    expect(await emailValidator.validate(periodEmail)).to.equal(true))
  const emailWSymbol =
    'disposable.style.email.with+symbol@example.com'.toUpperCase()
  it(`Emails with symbols are valid. (${emailWSymbol})`, async () =>
    expect(await emailValidator.validate(emailWSymbol)).to.equal(true))
  const emailWHyphen = 'other.email-with-hyphen@example.com'.toUpperCase()
  it(`Emails with hyphens are valid. (${emailWHyphen})`, async () =>
    expect(await emailValidator.validate(emailWHyphen)).to.equal(true))
  const emailWFQD = 'fully-qualified-domain@example.com'.toUpperCase()
  it(`Emails with fully qualified domains are valid. (${emailWFQD})`, async () =>
    expect(await emailValidator.validate(emailWFQD)).to.equal(true))
  const emailWTag = 'user.name+tag+sorting@example.com'.toUpperCase()
  it(`Emails with tags and sorting are valid. (${emailWTag})`, async () =>
    expect(await emailValidator.validate(emailWTag)).to.equal(true))
  const emailWSingleLetterLocal = 'x@example.com'.toUpperCase()
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
  const emailWHyphenDomain = 'example-indeed@strange-example.com'.toUpperCase()
  it(`Emails with a hyphenated domain are valid. (${emailWHyphenDomain})`, async () =>
    expect(await emailValidator.validate(emailWHyphenDomain)).to.equal(true))
  // This scenario would only be valid for a local server environment. Ignoring for now.
  // const emailWTLD = 'admin@mailserver1';
  // it(
  //   `Emails with only a Top Level Domain are valid. (${emailWTLD})`,
  //   () => expect( await emailValidator.validate(emailWTLD)).to.equal(true),
  // );

  const emailWSlash = 'test/test@test.com'.toUpperCase()
  it(`Emails with slashes are valid. (${emailWSlash})`, async () =>
    expect(await emailValidator.validate(emailWSlash)).to.equal(true))

  const emailWShortTLD = 'admin@test.co'.toUpperCase()
  it(`Email with short Top Level Domain are valid. (${emailWShortTLD})`, async () =>
    expect(await emailValidator.validate(emailWShortTLD)).to.equal(true))
  const emailWSpaceBetweenQuotes = '" "@example.org'.toUpperCase()
  it(`Email with space between quotes for username are valid. (${emailWSpaceBetweenQuotes})`, async () =>
    expect(await emailValidator.validate(emailWSpaceBetweenQuotes)).to.equal(
      true
    ))

  const doubleDotBeforeAtWQuote = '"john..doe"@example.com'.toUpperCase()
  it(`Emails with 2 dots together in the local are valid when in quotes. (${doubleDotBeforeAtWQuote})`, async () =>
    expect(await emailValidator.validate(doubleDotBeforeAtWQuote)).to.equal(
      true
    ))

  const emailWInternalQuoteWDots = 'just."not".right@example.com'.toUpperCase()
  it(`Emails with quotes that are surrounded by periods are valid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      true
    ))

  const bangifiedHostRoute = 'mailhost!username@example.org'.toUpperCase()
  it(`Emails with bangified host routes are valid. (${bangifiedHostRoute})`, async () =>
    expect(await emailValidator.validate(bangifiedHostRoute)).to.equal(true))

  const percentEscapedMailRoute = 'user%example.com@example.org'.toUpperCase()
  it(`Emails with % escaped mail routes are valid. (${percentEscapedMailRoute})`, async () =>
    expect(await emailValidator.validate(percentEscapedMailRoute)).to.equal(
      true
    ))

  const localEndingInNonAlphaNum = 'user-@example.org'.toUpperCase()
  it(`Emails that end in non-alphanumeric characters that are in the allowed printable characters are valid. (${localEndingInNonAlphaNum})`, async () =>
    expect(await emailValidator.validate(localEndingInNonAlphaNum)).to.equal(
      true
    ))

  const gmailEmail = 'test@gmail.com'.toUpperCase()
  it(`Gmail emails are valid. (${gmailEmail})`, async () =>
    expect(await emailValidator.validate(gmailEmail)).to.equal(true))
})

describe('Check invalid emails. | W/Out lowercase letters and lowercasing.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      alphaLower: false,
    },
    sanitize: {
      lowercase: false,
    },
  })

  const emailWOAt = 'Abc.example.com'.toUpperCase()
  it(`Emails without at symbol are invalid. (${emailWOAt})`, async () =>
    expect(await emailValidator.validate(emailWOAt)).to.equal(false))
  const emailWAtFirst = '@Abc.example.com'.toUpperCase()
  it(`Emails with the at symbol at the beginning are invalid. (${emailWAtFirst})`, async () =>
    expect(await emailValidator.validate(emailWAtFirst)).to.equal(false))
  const emailWMultiAts = 'A@b@c@example.com'.toUpperCase()
  it(`Emails with multiple ats are invalid. (${emailWMultiAts})`, async () =>
    expect(await emailValidator.validate(emailWMultiAts)).to.equal(false))
  const emailWUnquotedSpecialChars =
    'a"b(c)d,e:f;g<h>i[j\\k]l@example.com'.toUpperCase()
  it(`Emails with unquoted special chars are invalid. (${emailWUnquotedSpecialChars})`, async () =>
    expect(await emailValidator.validate(emailWUnquotedSpecialChars)).to.equal(
      false
    ))
  const emailWQuoteButNoDots = 'just"not"right@example.com'.toUpperCase()
  it(`Emails with quotes that are not the only thing but not seperated by dots are invalid. (${emailWQuoteButNoDots})`, async () =>
    expect(await emailValidator.validate(emailWQuoteButNoDots)).to.equal(false))
  const emailWSpacesQuotesBackslashOutsideQuotesNoBackslash =
    'this is"notallowed@example.com'.toUpperCase()
  it(`Emails with spaces, quotes, and backslashes outside of a quotes and not proceeded by a backslash are invalid. (${emailWSpacesQuotesBackslashOutsideQuotesNoBackslash})`, async () =>
    expect(
      await emailValidator.validate(
        emailWSpacesQuotesBackslashOutsideQuotesNoBackslash
      )
    ).to.equal(false))
  const emailWSpacesQuotesBackslashOutsideQuotes =
    'this still"not\\allowed@example.com'.toUpperCase()
  it(`Emails with spaces, quotes, and backslashes outside of a quotes are invalid. (${emailWSpacesQuotesBackslashOutsideQuotes})`, async () =>
    expect(
      await emailValidator.validate(emailWSpacesQuotesBackslashOutsideQuotes)
    ).to.equal(false))
  const emailWTooLongLocal =
    '1234567890123456789012345678901234567890123456789012345678901234+x@example.com'.toUpperCase()
  it(`Emails with more than 64 chars are invalid. (${emailWTooLongLocal})`, async () =>
    expect(await emailValidator.validate(emailWTooLongLocal)).to.equal(false))
  const emailWUnderscoredDomain =
    'i_like_underscore@but_its_not_allowed_in_this_part.example.com'.toUpperCase()
  it(`Emails with underscores in the domain are invalid. (${emailWUnderscoredDomain})`, async () =>
    expect(await emailValidator.validate(emailWUnderscoredDomain)).to.equal(
      false
    ))
  const emailWIconCharacters = 'QA☕CHOCOLATE☕@test.com'.toUpperCase()
  it(`Emails with icon characters invalid. (${emailWIconCharacters})`, async () =>
    expect(await emailValidator.validate(emailWIconCharacters)).to.equal(false))
  const emailWODomainPeriod = 'james@google'.toUpperCase()
  it(`Emails without a period in the domain are invalid. (${emailWODomainPeriod})`, async () =>
    expect(await emailValidator.validate(emailWODomainPeriod)).to.equal(false))
  const emailWPeriodNearEnd = 'james@google.c'
  it(`Emails with periods that are less than 2 chars from the end of the domain are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are invalid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      false
    ))
  const emailWSpaceButNoQuotes = 'james richards@google.com'.toUpperCase()
  it(`Emails with spaces but no quotes are invalid. (${emailWSpaceButNoQuotes})`, async () =>
    expect(await emailValidator.validate(emailWSpaceButNoQuotes)).to.equal(
      false
    ))
  const emailWSpaceButOnlyQuoteBefore =
    'james" richards@google.com'.toUpperCase()
  it(`Emails with spaces but only a quote before or after are invlaid. (${emailWSpaceButOnlyQuoteBefore})`, async () =>
    expect(
      await emailValidator.validate(emailWSpaceButOnlyQuoteBefore)
    ).to.equal(false))
  const emailWInvalidDomainChars = 'james@cb$.com'.toUpperCase()
  it(`Emails with invalid chars in the domain are invalid. (${emailWInvalidDomainChars})`, async () =>
    expect(await emailValidator.validate(emailWInvalidDomainChars)).to.equal(
      false
    ))
  const emailWQuoteButMissingDots = 'just."not"right@example.com'.toUpperCase()
  it(`Emails with quotes that are not the only thing but are missing some of the dots that should surround quotes are invalid. (${emailWQuoteButMissingDots})`, async () =>
    expect(await emailValidator.validate(emailWQuoteButMissingDots)).to.equal(
      false
    ))
  const doubleDotBeforeAt = 'john..doe@example.com'.toUpperCase()
  it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAt})`, async () =>
    expect(await emailValidator.validate(doubleDotBeforeAt)).to.equal(false))

  const doubleDotBeforeAtAndOneQuote = '"john..doe@example.com'.toUpperCase()
  it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAtAndOneQuote})`, async () =>
    expect(
      await emailValidator.validate(doubleDotBeforeAtAndOneQuote)
    ).to.equal(false))
  const doubleDotBeforeAtAndTwoQuotesBeforePeriods =
    '"john"..doe@example.com'.toUpperCase()
  it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAtAndTwoQuotesBeforePeriods})`, async () =>
    expect(
      await emailValidator.validate(doubleDotBeforeAtAndTwoQuotesBeforePeriods)
    ).to.equal(false))
  const doubleDotAfterAt = 'john.doe@example..com'.toUpperCase()
  it(`Emails with 2 dots together after the at are invalid. (${doubleDotAfterAt})`, async () =>
    expect(await emailValidator.validate(doubleDotAfterAt)).to.equal(false))

  const emailWInternalQuoteWDots = 'just."not."right@example.com'.toUpperCase()
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))
})

describe('Check valid emails. | W/Out numbers.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      numeric: false,
    },
  })

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

  const emailWInternalQuoteWDots = 'just."not".right@example.com'
  it(`Emails with quotes that are surrounded by periods are valid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
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
})

describe('Check invalid emails. | W/Out numbers.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      numeric: false,
    },
  })

  const emailWNumbers = 'simple1@example.com'
  it(`Valid emails with numbers are invalid. (${emailWNumbers})`, async () =>
    expect(await emailValidator.validate(emailWNumbers)).to.equal(false))
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
    'uayuYfBgRktoqVPCAJLhkcyVHFsZygReesttpNWTTiETtbQFfDUMZjyCdeaEhcotf+x@example.com'
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
  it(`Emails with periods that are less than 2 chars from the end of the domain are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are invalid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      false
    ))
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

  const emailWInternalQuoteWDots = 'just."not."right@example.com'
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))
})

describe('Check valid emails. | W/Out periods.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      period: false,
    },
  })

  const simpleEmail = 'simple@example.com'
  it(`Simple emails are valid. (${simpleEmail})`, async () =>
    expect(await emailValidator.validate(simpleEmail)).to.equal(true))
  const emailWSymbol = 'disposablestyleemailwith+symbol@example.com'
  it(`Emails with symbols are valid. (${emailWSymbol})`, async () =>
    expect(await emailValidator.validate(emailWSymbol)).to.equal(true))
  const emailWHyphen = 'otheremail-with-hyphen@example.com'
  it(`Emails with hyphens are valid. (${emailWHyphen})`, async () =>
    expect(await emailValidator.validate(emailWHyphen)).to.equal(true))
  const emailWFQD = 'fully-qualified-domain@example.com'
  it(`Emails with fully qualified domains are valid. (${emailWFQD})`, async () =>
    expect(await emailValidator.validate(emailWFQD)).to.equal(true))
  const emailWTag = 'username+tag+sorting@example.com'
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

  const emailWShortTLD = 'admin@test.co'
  it(`Email with short Top Level Domain are valid. (${emailWShortTLD})`, async () =>
    expect(await emailValidator.validate(emailWShortTLD)).to.equal(true))
  const emailWSpaceBetweenQuotes = '" "@example.org'
  it(`Email with space between quotes for username are valid. (${emailWSpaceBetweenQuotes})`, async () =>
    expect(await emailValidator.validate(emailWSpaceBetweenQuotes)).to.equal(
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
})

describe('Check invalid emails. | W/Out periods.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      period: false,
    },
  })

  const periodEmail = 'very.common@example.com'
  it(`Emails with periods are invalid. (${periodEmail})`, async () =>
    expect(await emailValidator.validate(periodEmail)).to.equal(false))
  const emailWOAt = 'Abc+example.com'
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
  it(`Emails with periods that are less than 2 chars from the end of the domain are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are invalid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      false
    ))
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

  const emailWInternalQuoteWDots = 'just."not."right@example.com'
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))

  // Invalid tests because they need periods.
  // const emailWQuoteButMissingDots = 'just."not"right@example.com'
  // it(`Emails with quotes that are not the only thing but are missing some of the dots that should surround quotes are invalid. (${emailWQuoteButMissingDots})`, async () =>
  //   expect(await emailValidator.validate(emailWQuoteButMissingDots)).to.equal(
  //     false
  //   ))
  // const doubleDotBeforeAt = 'john..doe@example.com'
  // it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAt})`, async () =>
  //   expect(await emailValidator.validate(doubleDotBeforeAt)).to.equal(false))

  // const doubleDotBeforeAtAndOneQuote = '"john..doe@example.com'
  // it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAtAndOneQuote})`, async () =>
  //   expect(
  //     await emailValidator.validate(doubleDotBeforeAtAndOneQuote)
  //   ).to.equal(false))
  // const doubleDotBeforeAtAndTwoQuotesBeforePeriods = '"john"..doe@example.com'
  // it(`Emails with 2 dots together in the local are invalid unless quoted. (${doubleDotBeforeAtAndTwoQuotesBeforePeriods})`, async () =>
  //   expect(
  //     await emailValidator.validate(doubleDotBeforeAtAndTwoQuotesBeforePeriods)
  //   ).to.equal(false))
  // const doubleDotAfterAt = 'john.doe@example..com'
  // it(`Emails with 2 dots together after the at are invalid. (${doubleDotAfterAt})`, async () =>
  //   expect(await emailValidator.validate(doubleDotAfterAt)).to.equal(false))
})

describe('Check valid emails. | W/Out printable chars, spaces, quotes, or hyphens in domain.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      printable: false,
      space: false,
      quote: false,
    },
    domain: {
      hyphen: false,
    },
  })

  const simpleEmail = 'simple@example.com'
  it(`Simple emails are valid. (${simpleEmail})`, async () =>
    expect(await emailValidator.validate(simpleEmail)).to.equal(true))
  const periodEmail = 'very.common@example.com'
  it(`Emails with periods are valid. (${periodEmail})`, async () =>
    expect(await emailValidator.validate(periodEmail)).to.equal(true))
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
  // This scenario would only be valid for a local server environment. Ignoring for now.
  // const emailWTLD = 'admin@mailserver1';
  // it(
  //   `Emails with only a Top Level Domain are valid. (${emailWTLD})`,
  //   () => expect( await emailValidator.validate(emailWTLD)).to.equal(true),
  // );

  const emailWShortTLD = 'admin@test.co'
  it(`Email with short Top Level Domain are valid. (${emailWShortTLD})`, async () =>
    expect(await emailValidator.validate(emailWShortTLD)).to.equal(true))

  const gmailEmail = 'test@gmail.com'
  it(`Gmail emails are valid. (${gmailEmail})`, async () =>
    expect(await emailValidator.validate(gmailEmail)).to.equal(true))
})

describe('Check invalid emails. | W/Out printable chars, spaces, quotes, or hyphens in domain.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    local: {
      printable: false,
      space: false,
      quote: false,
    },
    domain: {
      hyphen: false,
    },
  })

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
  it(`Emails with periods that are less than 2 chars from the end of the domain are invalid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(false))
  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are invalid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      false
    ))
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
  const emailWInternalQuoteWDots = 'just."not."right@example.com'
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))

  const localEndingInNonAlphaNum = 'user-@example.org'
  it(`Emails that end in non-alphanumeric characters are invalid. (${localEndingInNonAlphaNum})`, async () =>
    expect(await emailValidator.validate(localEndingInNonAlphaNum)).to.equal(
      false
    ))

  const percentEscapedMailRoute = 'user%example.com@example.org'
  it(`Emails with % escaped mail routes are invalid. (${percentEscapedMailRoute})`, async () =>
    expect(await emailValidator.validate(percentEscapedMailRoute)).to.equal(
      false
    ))

  const bangifiedHostRoute = 'mailhost!username@example.org'
  it(`Emails with bangified host routes are invalid. (${bangifiedHostRoute})`, async () =>
    expect(await emailValidator.validate(bangifiedHostRoute)).to.equal(false))

  const emailWInternalQuoteWDotsAround = 'just."not".right@example.com'
  it(`Emails with quotes that are surrounded by periods are invalid. (${emailWInternalQuoteWDotsAround})`, async () =>
    expect(
      await emailValidator.validate(emailWInternalQuoteWDotsAround)
    ).to.equal(false))

  const emailWSpaceBetweenQuotes = '" "@example.org'
  it(`Email with space between quotes for username are invalid. (${emailWSpaceBetweenQuotes})`, async () =>
    expect(await emailValidator.validate(emailWSpaceBetweenQuotes)).to.equal(
      false
    ))

  const doubleDotBeforeAtWQuote = '"john..doe"@example.com'
  it(`Emails with 2 dots together in the local are invalid when in quotes. (${doubleDotBeforeAtWQuote})`, async () =>
    expect(await emailValidator.validate(doubleDotBeforeAtWQuote)).to.equal(
      false
    ))

  const emailWSymbol = 'disposable.style.email.with+symbol@example.com'
  it(`Emails with symbols are invalid. (${emailWSymbol})`, async () =>
    expect(await emailValidator.validate(emailWSymbol)).to.equal(false))
  const emailWHyphen = 'other.email-with-hyphen@example.com'
  it(`Emails with hyphens are invalid. (${emailWHyphen})`, async () =>
    expect(await emailValidator.validate(emailWHyphen)).to.equal(false))
  const emailWFQD = 'fully-qualified-domain@example.com'
  it(`Emails with fully qualified domains are invalid. (${emailWFQD})`, async () =>
    expect(await emailValidator.validate(emailWFQD)).to.equal(false))
  const emailWTag = 'user.name+tag+sorting@example.com'
  it(`Emails with tags and sorting are invalid. (${emailWTag})`, async () =>
    expect(await emailValidator.validate(emailWTag)).to.equal(false))
  const emailWHyphenDomain = 'example-indeed@strange-example.com'
  it(`Emails with a hyphenated domain are invalid. (${emailWHyphenDomain})`, async () =>
    expect(await emailValidator.validate(emailWHyphenDomain)).to.equal(false))

  const emailWSlash = 'test/test@test.com'
  it(`Emails with slashes are invalid. (${emailWSlash})`, async () =>
    expect(await emailValidator.validate(emailWSlash)).to.equal(false))
})

describe('Check valid emails. | W/Out character length of domain.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    domain: {
      charsBeforeDot: -1,
      charsAfterDot: -1,
    },
  })

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

  const emailWInternalQuoteWDots = 'just."not".right@example.com'
  it(`Emails with quotes that are surrounded by periods are valid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
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

  const emailWPeriodNearEnd = 'james@google.c'
  it(`Emails with periods that are less than 2 chars from the end of the domain are valid. (${emailWPeriodNearEnd})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearEnd)).to.equal(true))

  const emailWPeriodNearBeginning = 'james@g.com'
  it(`Emails with periods that are less than 1 chars from the domain beginning are valid. (${emailWPeriodNearBeginning})`, async () =>
    expect(await emailValidator.validate(emailWPeriodNearBeginning)).to.equal(
      true
    ))
})

describe('Check invalid emails. | W/Out character length of domain.', async () => {
  const emailValidator = new EmailSyntaxValidator({
    domain: {
      charsBeforeDot: -1,
      charsAfterDot: -1,
    },
  })

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
  const emailWInternalQuoteWDots = 'just."not."right@example.com'
  it(`Emails with quotes that have periods next to them but are not onside are invalid. (${emailWInternalQuoteWDots})`, async () =>
    expect(await emailValidator.validate(emailWInternalQuoteWDots)).to.equal(
      false
    ))
})

describe('Check run time for 1000 emails.', async () => {
  const emailValidator = new EmailSyntaxValidator()

  const validEmail = 'test@google.com'
  const maxTime = 20
  it(`Valid emails run 1000 times should take less than ${maxTime} milliseconds.`, async () => {
    const startTime = performance.now()
    const promises = []
    for (let i = 0; i < 1000; i += 1) {
      promises.push(emailValidator.validate(validEmail))
    }
    await Promise.all(promises)
    const endTime = performance.now()

    console.log(`Valid emails took ${endTime - startTime} milliseconds`)

    return expect(endTime - startTime).to.be.below(maxTime)
  })
  const invalidEmail = 'invalid@cb$.com'
  it(`Invalid emails run 1000 times should take less than ${maxTime} milliseconds.`, async () => {
    const startTime = performance.now()
    const promises = []
    for (let i = 0; i < 1000; i += 1) {
      promises.push(emailValidator.validate(invalidEmail))
    }
    await Promise.all(promises)
    const endTime = performance.now()

    console.log(`Invalid emails took ${endTime - startTime} milliseconds`)

    return expect(endTime - startTime).to.be.below(maxTime)
  })
})
