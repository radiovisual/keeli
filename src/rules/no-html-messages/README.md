# no-html-messages

## Rule Details

**Default Severity**: `error`

Messages in your translation files should not contain any HTML syntax.

## Why?

> **TL;DR** It is safer and cleaner to keep HTML and style information outside of the strings you translate.

Putting HTML in the strings you want to translate can lead to a lot of different problems, just to name a few:

1. The translator needs to be aware of HTML syntax and be careful not to introduce syntax errors which can break the functionality/layout of your entire page
2. The translator might accidently translate the HTML reserved words (this is more common than you think!)
3. Putting HTML in your messages limits your ability to update attributes in the HTML. For example, [security settings](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#security_and_privacy) in your anchor `<a href>` tags
4. Adding classes or styles to your HTML can lead to UI/UX/layout/design problems, imagine something in your page breaking when you switch from one language to the other
5. Large HTML strings with lots of attributes, styles, etc compound all of these issues exponentially, and are often tricky to debug
6. Most automated UI tests do not test applications for all the different locales/languages supported by your site, so any of these problems mentioned above could be hiding in your translation files
7. If you put URLs in your translated messages, the URL strings can get translated, which can break the navigation of your site
8. It will be hard/impossible to enforce the same HTML/styles, convention, security settings, etc across all translated files

## Examples

Assuming `en.json` is where your default language is (the source file):

❌ Example of **incorrect** setup for this rule (HTML is used to style the text):

```js
en.json: { 'hello': 'Hi, <b>{firstName}</b>' }
fr.json: { 'hello': 'Salut, <b>{firstName}</b>' }
de.json: { 'hello': 'Hallo, <b>{firstName}</b>' }
```

❌ Example of **incorrect** setup for this rule (anchor tags / links are in the messages):

```js
en.json: { 'hello': 'Hi, <a href="https://example.com">Click here</a>' }
fr.json: { 'hello': 'Salut, <a href="https://example.com">Click ici</a>' }
de.json: { 'hello': 'Hallo, <a href="https://example.com">Click here</a>' }
```

✅ Examples of a **correct** setup for this rule (no HTML is found):

```js
en.json: { 'hello': 'Hi, {firstName}' }
fr.json: { 'hello': 'Salut, {firstName}' }
de.json: { 'hello': 'Hallo, {firstName}' }
```

## Example Configuration

Simple configuration where you just supply the severity level of `error` | `warn` | `off`:

```json
{
	"rules": {
		"no-html-messages": "error"
	}
}
```

## Advanced configuration options

This rule supports some advanced configuration.

Note that when you use the advanced configuration option you need to set the severity level using the `severity` property, otherwise the rule's default severity will apply.

### ignoreKeys

To disable the check for this rule for specific keys, you can pass in the name of the keys where you don't want this rule to run in the `ignoreKeys` array.

```json
{
	"rules": {
		"no-html-messages": {
			"severity": "error",
			"ignoreKeys": ["foo", "bar"]
		}
	}
}
```

> [!IMPORTANT]
> Be careful when using the `ignoreKeys` array: ignoring keys means means potentially ignoring real problems that can affect the UI/UX and reliability of your application.

## Version

This rule was introduced in i18n-validator v1.0.0.
