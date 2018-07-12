# ssmith-is-valid-email
## A Robust Tool for Validating Emails

[ ![Codeship Status for ssmith-wombatweb/is-valid-email](https://app.codeship.com/projects/7f59b370-6794-0136-94ad-6607b51510b1/status?branch=master)](https://app.codeship.com/projects/297684)
[![Code Coverage](https://codecov.io/gh/ssmith-wombatweb/is-valid-email/branch/master/graph/badge.svg)](https://codecov.io/gh/ssmith-wombatweb/is-valid-email/branch/master)
[![Dependencies](https://david-dm.org/ssmith-wombatweb/is-valid-email.svg)](https://david-dm.org/ssmith-wombatweb/is-valid-email.svg)
[![npm version](https://badge.fury.io/js/ssmith-is-valid-email.svg)](https://badge.fury.io/js/ssmith-is-valid-email)

[Project Repo](https://github.com/ssmith-wombatweb/is-valid-email)

This script checks the validity of a wide range of email types. It follows most of the rules outlined here: [Email Address - Wikipedia](https://en.wikipedia.org/wiki/Email_address). It was created because of performance issues with RegEx when working with emails in React.

### Author 
Written by Simeon Smith.

[Portfolio](https://www.simeonsmith.me) | [Resume](https://resume.simeonsmith.me) | [Github](https://github.com/ssmith-wombatweb)

## Installation

```
npm i -S ssmith-is-valid-email
```

## Using the Function

This function supports all modern browser including IE9+.

### Importing

#### ES6 JS

```javascript
import isValidEmail from 'ssmith-is-valid-email';
```

#### Common JS Import
```javascript
const isValidEmail = require('ssmith-is-valid-email');
```

### Calling the Function

```javascript
isValidEmail('test@google.com');
// Returns true or false.
```

## Testing

The following emails were tested. It follows most of the rules outlined here: [Email Address - Wikipedia](https://en.wikipedia.org/wiki/Email_address).

### Valid Emails

```
simple@example.com
very.common@example.com
disposable.style.email.with+symbol@example.com
other.email-with-hyphen@example.com
user.name+tag+sorting@example.com
x@example.com
example-indeed@strange-example.com
example@s.example
admin@test.co
" "@example.org
```

### Invalid Emails

```
Abc.example.com
@Abc.example.com
james@google
james@google.c
james richards@google.com
james" richards@google.com
james@cb$.com
A@b@c@example.com
a"b(c)d,e:f;g<h>i[j\\k]l@example.com
just"not"right@example.com
just."not"right@example.com
1234567890123456789012345678901234567890123456789012345678901234+x@example.com
john..doe@example.com
john.doe@example..com
```

### Not Yet Supported

#### Should Be Valid

```
"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com
```

#### Not Useful to Support

```
admin@mailserver1
```

## Performance

This script will run 1000 times on a valid or invalid email in less than 20 milliseconds.