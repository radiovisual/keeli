# i18n-validator [![CI](https://github.com/radiovisual/i18n-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/radiovisual/i18n-validator/actions/workflows/ci.yml)

> Configurable CLI validation tool to look for common problems in your translated source files.

## Why?

> Have you ever shipped "buggy" translation files to your users in production? **Probably**. I know I have!

Translated files in your software project are an often-overlooked source of problems that can affect the usability, reliability and reputation of your applications. These translated files are often edited manually, built automatically (without any integrity checks) or outsourced to third parties to provide translations, and then these files typically do not pass through any of your automated tests, or get skipped in your manual tests...which means the hidden problems get shipped to your real users in production. _If you are reading this right now, you have probably shipped "buggy" translation files to real users in production, am I right?_

Furthermore, there are best practices we want to adhere to with our translated files, and these best practices should be enforceable with an integrity check.

## Configuration

For each project where you want to run the i18n-validator, you will need to have a file named `i18n-validator.config.json` with the following format:

```json
{
	/**
	 * The locale your translations uses as the default or source language.
	 * Example: 'en'
	 *
	 **/
	"defaultLocale": "en",
	/**
	 * The filename of the file where your app's default/source language is defined.
	 * Example: "default.json" | "source.json" | "en.json"
	 *
	 **/
	"sourceFile": "en.json",
	/**
	 * An object describing the locale and its assosiated translation file name.
	 * Example: {"de": "de.json", "fr": "fr.json" }
	 *
	 **/
	"translationFiles": {
		"de": "de.json",
		"fr": "fr.json"
	},
	/**
	 * The path, relative to the root directory where your i18n files can be located.
	 * Example: 'relative/path/to/i18n/files'.
	 *
	 * Note: This relative path will be combined with the filenames you supplied in
	 * the translationFiles object to create the path to each translation file.
	 *
	 **/
	"pathToTranslatedFiles": "i18n",
	/**
	 * The rules configuration.
	 *
	 * You can set each rule to a severity level of: 'error' | 'warn' | 'off'
	 * Note: If you do not provide a severity setting for a rule, then the
	 * rule's default setting will apply.
	 *
	 * You can also pass in advanced configuration for some rules if you pass in
	 * an object like:
	 *
	 *     "rule-name": {
	 *        "severity": "error",
	 *        "ignoreKeys": ["foo", "bar"]
	 *     }
	 *
	 * Check the rule's documentation for advanced configuration options.
	 *
	 **/
	"rules": {
		"no-untranslated-messages": "error",
		"no-empty-messages": "error",
		"no-html-messages": "error",
		"no-invalid-variables": "error"
	},
	/**
	 * Set this dryRun setting to true to get all the same logging and reporting
	 * you would get in a real validation check, but no errors will be thrown if
	 * errors are found. Great for getting your i18n-validation setup in CI/CD
	 * pipelines without breaking your builds.
	 *
	 **/
	"dryRun": false,
	/**
	 * Enable or disable this entire i18n-validator.
	 *
	 **/
	"enabled": true
}
```

# Rule Defaults

Each rule has a default setting of `error`, `warn` or `off`, these defaults will apply if you do not provide a configuration for the rule in the configuration file.

> [!IMPORTANT]
> Pay special attention to any rules that have a default of `off`, these are opt-in rules that must be configured with a rule of `error` or `warn` in your configuration file before they will run.

| Rule name                | Default |
| ------------------------ | ------- |
| no-untranslated-messages | `error` |
| no-empty-messages        | `error` |
| no-invalid-variables     | `error` |
| no-html-messages         | `error` |

# Overriding Rules

Some rules can have advanced configuration passed in. Each rule might be different, so you want to read the documentation for each rule, but here are some of the more general overrides available:

## ignoreKeys

For validation rules that read through each key of a translated file, you can pass in an `ignoreKeys` array of strings that represent keys that should be ignored for the specific rule. Meaning, the rule will still run as expected on all keys, except for the keys specified. For example, if you have translation files that looks like this:

```json
{
	"en": { "ok": "OK" },
	"fr": { "ok": "OK" }
}
```

Then you might want the rule `no-untranslated-messages` to ignore this key `'ok'` because the translation of "ok" might also be "OK" and trigger a false positive in the rule.

To configure the `ignoreKeys` array you can assign an object to the rule name in the configuration file.

```json
{
	"rules": {
		"no-untranslated-messages": {
			"severity": "error",
			"ignoreKeys": ["ok"]
		}
	}
}
```

> [!IMPORTANT] > **Be careful when ignoring keys for specific rules**, ignored keys can lead to ignored problems!

> [!TIP]
> If you find that you are ignoring a lot of keys, consider moving some strings outside of your translated files (for example in a common messages library, etc)...

# Contributing

Contributions to this project are always welcome! :heart: Feel free to open issues, pull requests, etc and let's make this project better together.

---

:rainbow: :heart: :hamburger:
