# no-invalid-variables

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `validation`

All variables declared in the base messages file and any translated files must have valid syntax, and the variables declared in the base (source) messages file must exist in the translated string.

Additionally, if there are variables declared in the translated files, those same variables must exist in the source string.

### Key considerations

1. Whitespace is ignored in the comparison, so these two variables would be seen as the same: `{foo}` and `{  foo  }`
2. Variable comparisions are case-sensitive, so each of these variables will be seen as a different variable: `{foo}`, `{Foo}`, `{FOo}` and `{FOO}`
3. Strings with rouge brackets will trigger. For example, consider this string: `"Here is an opening bracket: {"`. The rule logic will see the opening bracket in the string and think there is a malformed variable syntax found. If you get these type of false positives, then you could consider using the `ignoreKeys` override in the configuation.

Assuming `en.json` is where your default language is (the source file):

❌ Example of **incorrect** setup for this rule (the `firstName` variable is missing or malformed):

```js
en.json: { 'hello': 'Hi, {firstName}' }
fr.json: { 'hello': 'Salut, {}' }
de.json: { 'hello': 'Hallo, firstName}' }
```

❌ Example of **incorrect** setup for this rule (the `firstName` variable has different casing):

```js
en.json: { 'hello': 'Hi, {firstName}' }
fr.json: { 'hello': 'Salut, {firstNAME}' }
de.json: { 'hello': 'Hallo, {FIRSTName}' }
```

❌ Example of **incorrect** setup for this rule (the `firstName` variable has been accidently translated):

```js
en.json: { 'hello': 'Hi, {firstName}' }
fr.json: { 'hello': 'Salut, {préNom}' }
de.json: { 'hello': 'Hallo, {vorName}' }
```

❌ Example of **incorrect** setup for this rule (mismatched brackets):

```js
en.json: { 'hello': 'Hi, {' }
fr.json: { 'hello': 'Salut, }' }
de.json: { 'hello': 'Hallo, {{}' }
```

❌ Example of **incorrect** setup for this rule (variables in the translated files do not exist in the source message):

```js
en.json: { 'hello': 'Hi' }
fr.json: { 'hello': 'Salut, {firstName}' }
de.json: { 'hello': 'Hallo, {firstName}' }
```

✅ Examples of a **correct** setup for this rule (all variables are the same):

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
		"no-invalid-variables": "error"
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
		"no-invalid-variables": {
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
