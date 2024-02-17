# Backend API

This project is a package that is used to create a backend API.

## How to use

1. Clone repo
2. Create SSL certs (see below for info)
3. Set environment variables (see below for info)
4. Run `npm install` on host machine (required for linting)
5. Run `docker-compose -f docker-compose.dev.yml up`
6. Run `docker ps` to get a list of running containers
7. Run `docker exec -it [API CONTAINER ID] sh`
8. Run existing database migrations `npm run prisma:migrate`
9. Run database seed `npm run prisma:seed`

## SSL Certs

We make use of Secure HTTP Only cookies in this project, therefore, you will need to make use of [MKCert](https://github.com/FiloSottile/mkcert) locally for SSL certificates.

- Create certificates for your `localhost` domain
- Name the generated files `cert.pem` and `cert-key.pem` accordingly.
- Add the certificates to the `nginx/certs` folder.

## Environment Variables

Create the following files at the project root

- .env

**_ORIGIN_URLS (comma separated string)_**
As part of the CSRF protection strategy, we need to set the URL we expect

Example:

```plain
https://localhost, https://yourdomain.com
```

**_LOG_LEVEL (string)_**

We use [wintson](https://www.npmjs.com/package/winston) logger, so the available options are

- debug
- warn
- info
- http
- verbose
- debug
- silly

**_JWT_SECRET / REFRESH_TOKEN_SECRET / PASSWORD_RESET_TOKEN_SECRET / CSRF_TOKEN_SECRET / COOKIE_SECRET (string)_**

Create a random string using [https://nodejs.org/api/crypto.html#cryptorandombytessize-callback](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback) for each variable.

Example:

```javascript
const crypto = require("crypto");

console.log(crypto.randomBytes(32).toString("hex"));

// copy and paste the result into your variable
```

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

**HUSKY (do not change)**

This variable is used for CI/CD pipelines to disable husky.

## Miscellaneous

- We make use of [Zod](https://zod.dev/) for validation on requests.
  - See `schemas` folder for validators.
  - See `middleware > schemaValidator` for validation middleware.
    <br />
- We make use of [React Email](https://react.email/) for email templates.
  - Templates are located in `emails/templates` folder.
  - Template variables are inserted using a text find and replace method. Therefore, when creating a variable use `[PLACEHOLDER TEXT]` (eg. `[NAME]`), then in the email service you will do a `html.replace([NAME], "value")`
  - Once templates are created you can run `npm run email:export` to generate the html file that the email service will use.

## To Do Items

- Unit tests with Jest
- E2E tests with Supertest
