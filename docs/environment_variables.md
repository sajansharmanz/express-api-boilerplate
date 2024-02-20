# Environment Variables

Create the following files at the project root

- .env

All the following variables must be set

**ORIGIN_URLS (comma separated string)**
As part of the CSRF protection strategy, we need to set the URL we expect

Example:

````plain
https://localhost, https://yourdomain.com

**LOG_LEVEL (string)**

We use [wintson](https://www.npmjs.com/package/winston) logger, so the available options are

- debug
- warn
- info
- http
- verbose
- debug
- silly

**ENCRYPTION_SECRET / JWT_SECRET / REFRESH_TOKEN_SECRET / PASSWORD_RESET_TOKEN_SECRET / CSRF_TOKEN_SECRET / COOKIE_SECRET (string)**

Create a random string using [https://nodejs.org/api/crypto.html#cryptorandombytessize-callback](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback) for each variable.

Example:

```javascript
const crypto = require("crypto");

console.log(crypto.randomBytes(32).toString("hex"));

// copy and paste the result into your variable
````

**DATABASE_URL (string)**

A relational database as outlined in [https://www.prisma.io/docs/orm/reference/supported-databases](https://www.prisma.io/docs/orm/reference/supported-databases)

**MAX_FAILED_LOGIN_ATTEMPTS (integer)**

An integer to set the number of attempts a user is allowed before their account is locked. After this they will need to reset their password, or contact an administrator to unlock them.

Recommended is 5.

**DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD (string)**

Email address and password for default system administrator user.

**NODEMAILER_HOST (string)**

Mail server send host name (eg. mail.yourdomain.com)

**NODEMAILER_PORT (integer)**

Mail server send port (eg. 25)

**NODEMAILER_SECURE (boolean)**

Whether the mail server uses HTTPS or not

**NODEMAILER_USERNAME / NODEMAILER_PASSWORD (string)**

Username and password for mail server

**OTP_ISSUER (string)**

The issuer used for Authenticator apps (eg. company name)

**OTP_LABEL (string)**

The label used for Authenticator apps (eg. app name )

**HUSKY - CI/CD ENVIRONMENTS ONLY!**

Set `HUSKY=0` as an environment variable
