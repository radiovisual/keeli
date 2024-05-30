# i18n-validator

> Fast, configurable and extendable CLI to look for common problems in your translated source files.

## Why?

> Have you ever shipped "buggy" translation files to your users in proudction? Probably. I know I have!

Translated files in your software project are an often-overlooked source of problems that can affect the usability and reliability of your applications. These translated files are often edited manually, built automatically (without any integrity checks) or outsourced to a third party to provide translations, and then these files typically do not pass through any of your automated tests, or get skipped in your manual tests...which means the hidden problems get shipped to your users in production. If you are reading this right now, you have probably shipped "buggy" translation files to real users in production, am I right?

Furthermore, there are best practices we want to adhere to with our translated files, and these best practices should be enforceable with an integrity check.

## Configuration

For each project where you want to run the i18n-validator, you will need to have a file named `i18n-validator.config.json` with the following format:

```json
{
  /**
   * The locale your application uses as the default language.
   * Example: 'en'
   *
   **/
  "defaultLocale": "en",
  /**
   * This is the name of the JSON file where your app's default language is defined.
   * Example: 'en.json' or 'source.json'
   *
   **/
  "sourceFile": "en.json",
  /**
   * A list of languages or locales you translate to.
   * Example: ['de', 'fr', 'en_GB']
   *
   **/
  "supportedTranslations": ["de", "fr"],
  /**
   * The path, relative to the root directory where your i18n files can be located.
   * Example: ['de', 'fr', 'en_GB']
   *
   **/
  "pathToTranslatedFiles": "i18n",
  /**
   * The rules configuration. You can set each rule to 'error', 'warn' or 'off'
   * Note: If you do not provide a setting for a rule, then the rule's default setting will apply.
   *
   **/
  "rules": {
    "no-untranslated-files": "error",
  },
  /**
   * Set this dryRun setting to true to get all the same logging and reporting you would
   * get in a real validation check, but no errors will be thrown if errors are found.
   * Great for getting your i18n-validation setup in CI/CD pipelines without breaking your builds.
   *
   **/
  "dryRun": false,
  /**
   * Enable or disable this entire i18n-validator.
   *
   **/
  "enabled": true,
};
```

# Rule Defaults

Each rule has a default setting of `error`, `warn` or `off`, these defaults will apply if you do not provide a configuration for the rule in the configuration file.

> [!IMPORTANT]
> Pay special attention to any rules that have a default of `off`, these are opt-in rules that must be configured with a rule of `error` or `warn` in your configuration file before they will run.

| Rule name             | Default |
| --------------------- | ------- |
| no-untranslated-files | `error` |

# Contributing

Contributing to this project is always welcome! Open issues, Pull Requests, etc and let's make this project better together.

---

:rainbow: :heart: :hamburger:
