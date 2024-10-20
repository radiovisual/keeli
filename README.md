# keeli [![CI](https://github.com/radiovisual/keeli/actions/workflows/ci.yml/badge.svg)](https://github.com/radiovisual/keeli/actions/workflows/ci.yml) [![codecov](https://codecov.io/github/radiovisual/keeli/graph/badge.svg?token=G4X3X08FB6)](https://codecov.io/github/radiovisual/keeli)

> Configurable CLI validation tool to look for common problems in your translated source files.

## Why?

> Have you ever shipped "buggy" translation files to your users in production? **Probably!** I know I have!

**Let's face it, we all make mistakes (developers, translators, copywriters, marketers, humans, etc)**. Our translation files in our software should be protected against the most common mistakes.

Translated files in your software project are an often-overlooked source of problems that can affect the usability, reliability and reputation of your application(s). These translated files are often edited manually, built automatically (without any integrity checks) or outsourced to third parties to provide translations. These files typically do not pass through any (or most) of your automated tests, or they easily get skipped in your manual tests...which means the hidden problems get shipped to your real users in production.

Furthermore, there are best practices we want to adhere to with our translated files, and these best practices should be enforceable with an integrity check.

## Keeli to the rescue!

Keeli will help you automatically discover many problems with your translation files, including:

- ✅ Finds untranslated messages
- ✅ Finds empty messages
- ✅ Finds missing variables
- ✅ Finds accidentally translated variables
- ✅ Finds variable syntax errors
- ✅ Finds missing keys
- ✅ Finds unknown/un-balanced keys
- ✅ Finds keys violating your naming convention
- ✅ Finds extra whitespace
- ✅ Finds HTML in messages
- ✅ _...and more!_

Most of these rules are configurable so you can customize keeli to your specific needs.

## Global Installation

If you want the `keeli` command to be globally available on your system, you can install it globally:

```bash
npm install --global keeli
```

And then you have the `keeli` command in your terminal. Now you are ready to [configure Keeli for your first validation check](#configuration). 🎉

## Project Installation

If you don't need the `keeli` command to be available globally on your system, then you can install Keeli into your project directly into `devDependencies` using the package manager of your choice:

**npm**

```
npm install --save-dev keeli
```

**yarn**

```
yarn add keeli -D
```

**pnpm**

```
pnpm add keeli --save-dev
```

Then you can use the `keeli` command in your package.json scripts, for example: `"validate-i18n": "keeli"` or `"validate-i18n": "npx keeli"`

## Configuration

For each project where you want to run the keeli, you will need to have a file named `keeli.config.json` in the project root where your internationalization files are defined.

> [!TIP]
> You can also pass in a custom configuration file path location with keeli's `--config` option.

Each configuration file should be a valid JSON file and have a similar format to this (with comments removed):

```json5
{
	/**
	 * The locale your translations uses as the default or source language.
	 * Example: 'en'
	 *
	 **/
	defaultLocale: "en",
	/**
	 * The filename of the file where your app's default/source language is defined.
	 * Example: "default.json" | "source.json" | "en.json"
	 *
	 **/
	sourceFile: "en.json",
	/**
	 * An object describing the locale and its associated translation file name.
	 * Example: {"de": "de.json", "fr": "fr.json" }
	 *
	 **/
	translationFiles: {
		de: "de.json",
		fr: "fr.json",
	},
	/**
	 * The path, relative to the root directory where your i18n files can be located.
	 * Example: 'relative/path/to/i18n/files'.
	 *
	 * Note: This relative path will be combined with the filenames you supplied in
	 * the translationFiles object to create the path to each translation file.
	 *
	 **/
	pathToTranslatedFiles: "i18n",
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
	rules: {
		"no-empty-messages": "error",
		"no-extra-whitespace": "error",
		"no-html-messages": "error",
		"no-invalid-variables": "error",
		"no-untranslated-messages": "error",
		"no-malformed-keys": "error",
		"no-missing-keys": "error",
	},
	/**
	 * Set this dryRun setting to true to get all the same logging and reporting
	 * you would get in a real validation check, but no errors will be thrown if
	 * errors are found. Great for getting your i18n-validation setup in CI/CD
	 * pipelines without breaking your builds.
	 *
	 **/
	dryRun: false,
	/**
	 * Enable or disable this entire keeli.
	 *
	 **/
	enabled: true,
	/**
	 * Enable or disable verbose logging mode.
	 *
	 **/
	verbose: false,
}
```

> [!TIP]
> Your configuration file does need to be complete, if you do not specify a value for any parameter that is not required, then the default configuration value will apply. If you forget to provide a value for a required value, then keeli will throw a useful error.

# Rule Defaults

Each rule (that allows you to configure the severity) can have a default setting of `error`, `warn` or `off`, these defaults will apply if you do not provide a configuration for the rule in the configuration file.

| Rule name                                                                                                     | Default |
| ------------------------------------------------------------------------------------------------------------- | ------- |
| [no-empty-messages](https://github.com/radiovisual/keeli/tree/main/src/rules/no-empty-messages)               | `error` |
| [no-extra-whitespace](https://github.com/radiovisual/keeli/tree/main/src/rules/no-extra-whitespace)           | `error` |
| [no-html-messages](https://github.com/radiovisual/keeli/tree/main/src/rules/no-html-messages)                 | `error` |
| [no-untranslated-messages](https://github.com/radiovisual/keeli/tree/main/src/rules/no-untranslated-messages) | `error` |
| [no-invalid-variables](https://github.com/radiovisual/keeli/tree/main/src/rules/no-invalid-variables)         | `error` |
| [no-malformed-keys](https://github.com/radiovisual/keeli/tree/main/src/rules/no-malformed-keys)               | `error` |
| [no-missing-keys](https://github.com/radiovisual/keeli/tree/main/src/rules/no-missing-keys)                   | `error` |
| [no-invalid-configuration](https://github.com/radiovisual/keeli/tree/main/src/rules/no-missing-keys)          | `error` |
| [no-invalid-severity](https://github.com/radiovisual/keeli/tree/main/src/rules/no-missing-keys)               | `error` |

# Un-configurable Rule Defaults

The following rules are not configurable, meaning you should not add these rules to your configuration files, but these rules run with their default severity shown below:

| Rule name                                                                                                     | Default |
| ------------------------------------------------------------------------------------------------------------- | ------- |
| [no-invalid-configuration](https://github.com/radiovisual/keeli/tree/main/src/rules/no-invalid-configuration) | `error` |
| [no-invalid-severity](https://github.com/radiovisual/keeli/tree/main/src/rules/no-invalid-severity)           | `error` |

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

> [!IMPORTANT]
> Be careful when ignoring keys for specific rules, ignored keys can lead to ignored problems!

> [!TIP]
> If you find that you are ignoring a lot of keys, consider moving some strings outside of your translated files (for example in a common messages library, etc)...

# Tracking Ignored Problems

A feature of this CLI tool is that whenever you intentionally skip/ignore a known problem, these problems are still tracked and reported by default (as of now, there is also no way for you to opt-out of seeing ignored problems in the log output, pull requests welcome!), **but any ignored errors won't fail your build, they are merely reported in the logs**.

One of the main motivations with this CLI is to _expose_ (not hide) the problems in your translation files. I believe that ignoring problems and not showing these ignored problems in the logs prevents new problems from creeping into the files and also helps encourage best practices, additional benefits include: tracking technical debt and showing the consequences/risks you might be taking by ignoring actual problems.

# Contributing

Contributions to this project are always welcome! :heart: Feel free to open issues, pull requests, etc and let's make this project better together.

If you have the repo cloned locally, you can test run the CLI by running:

`npm run build:dev && node dist/index.js`, which will run all of the validation rules on the translation files in the fixtures directory.

> [!TIP]
> If you have the CLI linked with `npm link` then you can just run `npm run build:dev && keeli`

# Publishing

Create a GitHub release with the version number you want to create. Make sure the tag you create matches the version number (e.g., `v1.2.3`) and release! GitHub actions will take over and attempt to publish the package version you specified. Note that a Pull request will get opened on the repo automatically to bump the package version to align with the latest release. This PR should be merged ASAP after opened to keep things in sync.

---

🌐 💻️
