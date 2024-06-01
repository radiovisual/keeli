# no-untranslated-messages

## Rule Details

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

```json
{
	"rules": {
		"no-untranslated-messages": "error"
	}
}
```

## Version

This rule was introduced in i18n-validator v1.0.0.
