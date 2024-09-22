# no-malformed-keys

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `validation`
**Default Naming Convention**: `camel-case`

All keys declared in the source file must use a consistent naming convention.

Assuming `en.json` is where your default language is (the source file):

❌ Example of **incorrect** setup for this rule (the translation file is missing the `hi` key, and the translation file defines a key `hello` which is not found in the base file):

```js
en.json: {
	'snake_case': 'snakes!'
	'camelCase': 'camels!',
	'PascalCase': 'pascal!',
	'kebab-case': 'kebab!',
}
```

✅ Examples of a **correct** setup for this rule (all keys use the same naming convention):

```js
en.json: {
	'snakeCase': 'snakes!'
	'camelCase': 'camels!',
	'pascalCase': 'pascal!',
	'kebabCase': 'kebab!',
}
```

## Important Considerations

### Keeli sees "flattened" keys

Each delimited segment of your key must use the same naming convention. For example, if you have complex/nested JSON structures in your translation file that looks like this:

```json
{
	"some_super": {
		"duper_deeply": {
			"super_nested": {
				"message": "hello!"
			}
		}
	}
}
```

keeli will see a flat version of this key when it validates the key names:

```json
{ "some_super.duper_deeply.super_nested.message": "hello!" }
```

All of the delimited segments in this key: `some_super`, `duper_deeply`, `super_nested` and `message` will all need to match your specified naming convention to be considered valid. If for some reason you are not satisfied with these rules, then you can always [use your own validation function](#provide-your-own-validation-function)

> [!IMPORTANT]
> When nested JSON structures are "flattened", keeli will use a period character (e.g., `.`) to concatenate the keys (see example above). When keeli runs its validations on your period-delimited keys it will try to ensure that each value in-between the periods match the naming convention you are using (i.e., `camel-case`, `snake-case`, etc). So be careful to maintain your naming convention in-between your own use of periods, if you choose to use them in your keys. If you pass in your own custom validation function, you will get the entire flattened key to handle how you choose.

## Example Configuration

Simple configuration where you just supply the severity level of `error` | `warn` | `off`:

```json
{
	"rules": {
		"no-malformed-keys": "warn"
	}
}
```

> [!IMPORTANT] > `camel-case` will be used as the default naming convention unless you use an advanced configuration option to [use a different naming convention](#use-a-different-naming-convention), or [use your own custom validation function](#provide-your-own-validation-function).

## Advanced configuration options

### Use a different naming convention

The naming conventions that Keeli is able to validate "out of the box" are the following:

- `snake-case`: `snake_case_looks_like_this`
- `pascal-case`: `PascalCaseLooksLikeThis`
- `kebab-case`: `kebab-case-looks-like-this`
- `camel-case`: `camelCaseLooksLikeThis`

To set the naming convention, use the `namingConvention` property:

```json
{
	"rules": {
		"no-malformed-keys": {
			"severity": "error",
			"namingConvention": "snake-case"
		}
	}
}
```

### Provide your own validation function

If you have very specific naming convention rules, you can enforce it by supplying your own validation function with the `validationFunctionPath` advanced configuration option. Be sure to use a path that is relative to the keeli configuration file:

```json
{
	"rules": {
		"no-malformed-keys": {
			"severity": "error",
			"validationFunctionPath": "path/to/your/validation/function.js"
		}
	}
}
```

The validation file should export a single function that accepts the key being validated as the only parameter:

The function signature should look like this:

```typescript
(key: string) => boolean;
```

Here is an example:

```js
module.exports = (key) => {
	function isValidKey(key) {
		// Your custom rules to check key naming conventions.
		// Return true if key is valid, otherwise false.
	}
	return isValidKey(key);
};
```

Your custom function must return `true` if the provided `key` parameter is valid, otherwise `false`.

**Note:** If your validation files are complex nested JSON objects, the `key` parameter sent to your validation function will be the "flattened" key. See this section ["Keeli sees flattened keys"](#keeli-sees-flattened-keys) for more information.

**Note:** Your validation function wont receive any keys you have added to the [ignoreKeys array](#ignorekeys)

> [!IMPORTANT]
> If you pass in your own validation function, _you are in complete control_, keeli will not do any additional validations outside of your custom function.

### Ignore specific keys

To disable the check for this rule for specific keys, you can pass in the name of the keys where you don't want this rule to run into the `ignoreKeys` array.

```json
{
	"rules": {
		"no-malformed-keys": {
			"severity": "error",
			"ignoreKeys": ["foo", "bar"]
		}
	}
}
```

## Version

This rule was introduced in keeli v1.0.0.
