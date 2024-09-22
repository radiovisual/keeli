# no-extra-whitespace

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `validation`

Messages in your translation files should not contain any whitespace before or after the message, or more than 1 contiguous whitespace character inside the message.

## Why?

Whitespace is sometimes deliberately added to the messages in your application to help solve some styling or layout issues. This is not recommended since it becomes hard to maintain consistent whitespace across all your translated strings and is an easy source of layout-related bugs in your application. It is safer and cleaner to let your application make layout decisions, and treat extraneous whitespace in your translated strings as unintended/accidental.

## Examples

Assuming `en.json` is where your default language is (the source file):

❌ Example of **incorrect** setup for this rule (leading and trailing whitespace found):

```js
en.json: { 'hello': '   Hi, <b>{firstName}</b>  ' }
fr.json: { 'hello': '   Salut, <b>{firstName}</b>  ' }
de.json: { 'hello': '   Hallo, <b>{firstName}</b>  ' }
```

❌ Example of **incorrect** setup for this rule (too much internal whitespace found):

```js
en.json: { 'hello': 'Hi,       <b>{firstName}</b>  ' }
fr.json: { 'hello': 'Salut,    <b>{firstName}</b>  ' }
de.json: { 'hello': 'Hallo,    <b>{firstName}</b>  ' }
```

✅ Examples of a **correct** setup for this rule (no whitespace padding is found):

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
		"no-extra-whitespace": "error"
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
		"no-extra-whitespace": {
			"severity": "error",
			"ignoreKeys": ["foo", "bar"]
		}
	}
}
```

> [!IMPORTANT]
> Be careful when using the `ignoreKeys` array: ignoring keys means means potentially ignoring real problems that can affect the UI/UX and reliability of your application.

## Version

This rule was introduced in keeli v1.0.0.
