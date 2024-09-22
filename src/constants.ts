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
