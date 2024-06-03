# no-untranslated-messages

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `validation`

:bulb: This rule runs on the translated files, so its considered a `validation` rule type.

All messages in the translation files must be translated. This means that the `value` from the `key:value` pairs in the translated files can't be the same as in the source file.

Assuming `en.json` is where your default language is (the source file):

❌ Example of **incorrect** setup for this rule (no messages are translated):

```js
en.json: { 'hello': 'Hi!' }
fr.json: { 'hello': 'Hi!' }
de.json: { 'hello': 'Hi!' }
```

❌ Example of an **incorrect** setup for this rule (some locales have untranslated messages):

```js
en.json: { 'hello': 'Hi!' }
fr.json: { 'hello': 'Salut!' }
de.json: { 'hello': 'Hi!' }
```

✅ Examples of a **correct** setup for this rule (all messages are translated):

```js
en.json: { 'hello': 'Hi!' }
fr.json: { 'hello': 'Salut!' }
de.json: { 'hello': 'Hallo!' }
```

## Example Configuration

Simple configuration where you just supply the severity level:

```json
{
	"rules": {
		"no-untranslated-messages": "error"
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
		"no-untranslated-messages": {
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
