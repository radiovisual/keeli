export const SEVERITY_LEVEL = {
	off: "off",
	warn: "warn",
	error: "error",
};

export const validSeverities = Object.values(SEVERITY_LEVEL);

export const RULE_TYPE = {
	validation: "validation",
	configuration: "configuration",
};

export const keyNamingConventions = {
	snakeCase: "snake-case",
	camelCase: "camel-case",
	pascalCase: "pascal-case",
	kebabCase: "kebab-case",
};

export const validKeyNamingConventions = Object.values(keyNamingConventions);

/**
 * Export a list of the rule names that are configurable
 */
export const configurableRuleNames: string[] = [
	"no-empty-messages",
	"no-untranslated-messages",
	"no-invalid-variables",
	"no-html-messages",
	"no-missing-keys",
	"no-malformed-keys",
	"no-extra-whitespace",
];

/**
 * Export a list of the rule names that are NOT configurable
 */
export const unConfigurableRuleNames: string[] = [
	"no-invalid-configuration",
	"no-invalid-severity",
];
