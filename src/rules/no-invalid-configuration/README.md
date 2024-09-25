# no-invalid-configuration

## Rule Details

**Default Severity**: `error`  
**Rule Type**: `configuration`

The settings you supply in the configuration file must be valid and complete.

This rule makes the following checks that your configuration is ready to go.

1. That the configuration file is present and in the correct format
2. That you have supplied all required information for the validation routine to proceed. For example, you have supplied:
   1. A valid `defaultLocale`
   2. A valid `sourceFile`
   3. Valid `translationFiles` object
   4. A valid `pathToTranslatedFiles` string
   5. Only known rules can be passed into the `rules` section

✅ Examples of a **correct** setup for this rule (all messages are non-empty, and valid rules are used):

```json
{
	"defaultLocale": "your-default-locale",
	"sourceFile": "filename-of-your-default-messages",
	"translationFiles": {
		"locale": "filename-of-this-locales-messages"
	},
	"pathToTranslatedFiles": "path/to/translation/files/directory",
	"rules": {
		"no-html-messages": "warn"
	}
}
```

> [!IMPORTANT]
> Configuration rules like this run before any of the validation rules. If the configuration rules find any problems, the validation routine might exit early or be skipped entirely.

## Configuration

This rule is not configurable, i.e., you can't assign a severity level or turn the rule off.

## Version

This rule was introduced in keeli v1.0.0.
