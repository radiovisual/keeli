# no-empty-messages

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `validation`

The no-empty-messages rule ensures that all messages in the translation files are not empty strings. It also verifies that messages in the base locale are not empty.

The rule runs through all the messages in the translation files and checks for:

1. Empty messages in the base locale file.
2. Empty messages in the translation files that correspond to a non-empty message in the base locale file.

Assuming `en.json` is where your default language is (the source file):

❌ Example of **incorrect** setup for this rule (all messages are empty):

```js
en.json: { 'hello': '' }
fr.json: { 'hello': '' }
de.json: { 'hello': '' }
```

❌ Example of an **incorrect** setup for this rule (some locales have empty messages):

```js
en.json: { 'hello': '' }
fr.json: { 'hello': 'Salut!' }
de.json: { 'hello': 'Hi!' }
```

✅ Examples of a **correct** setup for this rule (all messages are non-empty):

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
		"no-empty-messages": "error"
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
		"no-empty-messages": {
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
