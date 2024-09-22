import _ from "lodash";

/**
 * Check if a string is empty.
 * @param value
 * @returns boolean
 */
export function isEmptyString(value: string): boolean {
	return typeof value === "string" && value.trim() === "";
}

export function isCamelCase(key: string) {
	return !isEmptyString(key) && _.camelCase(key) === key;
}

export function isSnakeCase(key: string) {
	return !isEmptyString(key) && _.snakeCase(key) === key;
}

export function isPascalCase(key: string) {
	const pascalKey = _.upperFirst(_.camelCase(key));
	return !isEmptyString(key) && pascalKey === key;
}

export function isKebabCase(key: string) {
	return !isEmptyString(key) && _.kebabCase(key) === key;
}

export function stringHasWhitespacePadding(message: string) {
	return message.trim() !== message;
}

export function stringHasExtraneousWhitespace(message: string) {
	return message.replace(/\s+/gm, " ") !== message;
}
