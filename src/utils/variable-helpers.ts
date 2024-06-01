import type { MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import * as icu from "@formatjs/icu-messageformat-parser";

export function extractVariableNamesFromMessage(
	message: string
): string[] | undefined {
	const parsedString = icu.parse(message);

	const variables = parsedString
		.filter((token) => token?.type === 1 && token.value)
		// TODO: find the correct types for this parser result
		// @ts-ignore - the "value" object is not recognized on the parser result
		.map((token) => token.value);

	if (variables.length > 0) {
		return variables;
	}

	return undefined;
}

export function extractVariablesFromLocaleData(localeData: {
	[key: string]: {};
}) {
	const messageVariables: { [key: string]: string[] } = {};

	// Extract all of the expected variables from the source file
	for (let [key, value] of Object.entries(localeData)) {
		let variables;

		if (typeof value === "string") {
			try {
				variables = extractVariableNamesFromMessage(value);
			} catch (err: unknown) {
				// Fail silently here. There are many rules that will catch the problems we could be silencing here.
				// The main goal of this function is to extract the known/valid variables.
			}
		}

		if (variables) {
			messageVariables[key] = variables;
		}
	}

	return messageVariables;
}

/**
 * Checks if a message string has unbalanced brackets. Unbalanced brackets results in invalid variables.
 * @param message
 * @returns boolean
 */
export function hasUnbalancedBrackets(message: string): boolean {
	const openingBrackets = ["{"];
	const closingBrackets = ["}"];
	const matchingBrackets = {
		"}": "{",
	};
	const stack = [];

	if (
		(message.length === 1 && openingBrackets.includes(message)) ||
		closingBrackets.includes(message)
	) {
		return true;
	}

	for (let char of message.split("")) {
		if (openingBrackets.includes(char)) {
			stack.push(char);
		} else if (closingBrackets.includes(char)) {
			if (stack.length === 0) {
				return true;
			} else if (
				stack.length > 0 &&
				// @ts-expect-error
				stack[stack.length - 1] === matchingBrackets[char]
			) {
				stack.pop();
			} else {
				return true;
			}
		}
	}

	return stack.length !== 0;
}
