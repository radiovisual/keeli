# no-invalid-severity

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `configuration`

The severity you supply in the configuration file for rules must be strings: `error`, `warn` or `off`.

✅ Examples of a **correct** setup for this rule (all rules have correct values):

```json
rules: {
	"no-untranslated-messages": "error",
	"no-empty-messages": "warn",
	"no-html-messages": "off",
	"no-invalid-variables": "error",
	"no-missing-keys": "warn",
},
```

❌ Example of **incorrect** setup for this rule (rules are not using known string values of `error`, `warn` or `off`):

```json
rules: {
	"no-untranslated-messages": "",
	"no-empty-messages": "foo",
	"no-html-messages": "     ",
	"no-invalid-variables": "disabled",
	"no-missing-keys": false,
},
```

> [!IMPORTANT]
> Configuration rules like this run before any of the validation rules. If the configuration rules find any problems, the validation routine might exit early or be skipped entirely.

## Configuration

This rule is not configurable, i.e., you can't assign a severity level or turn the rule off.

## Version

This rule was introduced in keeli v1.0.0.
