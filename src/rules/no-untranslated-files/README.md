# no-untranslated-files

## Rule Details

:bulb: This rule runs on the translated files, so its considered a `validation` rule type.

Files that are not in the default language must be translated. This means that ALL the key:value pairs in the translated files can't be the same as in the source file.

Assuming `en.json` is where your default language is:

❌ Example of **incorrect** setup for this rule:

```js
en.json: { 'hello': 'Hi!' }
fr.json: { 'hello': 'Hi!' }
de.json: { 'hello': 'Hi!' }
```

❌ Another example of an **incorrect** setup is where just one or more files are untranslated:

```js
en.json: { 'hello': 'Hi!' }
fr.json: { 'hello': 'Salut!' }
de.json: { 'hello': 'Hi!' }
```

✅ Examples of a **correct** setup for this rule:

```js
en.json: { 'hello': 'Hi!' }
fr.json: { 'hello': 'Salut!' }
de.json: { 'hello': 'Hallo!' }
```

## Notes

ALL of the values in the translated json must be the same as the source file in order for the file to be considered untranslated.

## Version

This rule was introduced in i18n-validator v1.0.0
