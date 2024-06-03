# no-missing-keys

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `validation`

All keys declared in the source file must be the only keys in each of the translated files.

Assuming `en.json` is where your default language is (the source file):

❌ Example of **incorrect** setup for this rule (the translation file is missing the `hi` key, and the translation file defines a key `hello` which is not found in the base file):

```js
en.json: { 'hi': 'Hi!' }
fr.json: { 'hello': 'Salut!' }
```

✅ Examples of a **correct** setup for this rule (all keys are the same):

```js
en.json: { 'hi': 'Hi!' }
fr.json: { 'hi': 'Salut!' }
```

## Example Configuration

Simple configuration where you just supply the severity level of `error` | `warn` | `off`:

```json
{
	"rules": {
		"no-missing-keys": "error"
	}
}
```

## Advanced configuration options

This rule does not support any advanced configuration.

## Version

This rule was introduced in i18n-validator v1.0.0.
