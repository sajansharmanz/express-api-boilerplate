# Miscellaneous

- We make use of [Zod](https://zod.dev/) for validation on requests.
  - See `schemas` folder for validators.
  - See `middleware > schemaValidator` for validation middleware.
    <br />
- We make use of [React Email](https://react.email/) for email templates.
  - Templates are located in `emails/templates` folder.
  - Template variables are inserted using a text find and replace method. Therefore, when creating a variable use `[PLACEHOLDER TEXT]` (eg. `[NAME]`), then in the email service you will do a `html.replace([NAME], "value")`
  - Once templates are created you can run `npm run email:export` to generate the html file that the email service will use.
