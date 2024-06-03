import { SEVERITY_LEVEL } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import {
	extractVariableNamesFromMessage,
	extractVariablesFromLocaleData,
	hasUnbalancedBrackets,
} from "../../utils/variable-helpers.ts";
import {
	getMissingVariableFromSourceProblem,
	getMismatchedVariableFromSourceProblem,
	getInvalidVariableSyntaxProblem,
	getUnbalancedVariableBracketsSyntaxProblem,
} from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-invalid-variables",
	description: `All variables in each of the translation files must match the variables declared in the source file and have a valid syntax.`,
	url: "TBD",
	type: "validation",
	defaultSeverity: "error",
};

const noInvalidVariables: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore,
		context: RuleContext
	) => {
		const { defaultLocale } = config;
		const { severity, ignoreKeys } = context;
		const baseLocale = translationFiles[config.defaultLocale];

		if (severity === SEVERITY_LEVEL.off) {
			return;
		}

		// Extract the valid variables from the base messages file.
		// These variables are expected to be in each translated file.
		const baseMessageVariables = extractVariablesFromLocaleData(baseLocale);

		for (let [locale, data] of Object.entries(translationFiles)) {
			for (let [key, value] of Object.entries(data)) {
				const isIgnored = ignoreKeys.includes(key);

				// Check all files for unbalanced brackets, which can lead to syntax errors
				// We report these first since if they exist they tend to mess with the other
				// rules. If these problems get fixed by the user first then a few of the other
				// errors might get cleared up on their own. Note: that we have to do this check
				// seperate from the icu.parse() call, since the parser does not see trailing
				// closing brackets as a problem.
				if (hasUnbalancedBrackets(value)) {
					problemStore.report(
						getUnbalancedVariableBracketsSyntaxProblem({
							key,
							locale,
							severity,
							ruleMeta,
							// TODO: highlight the area where the problem occured
							// since the error comes with location offsets where the error is found
							received: value,
							isIgnored,
						})
					);
				}

				// Now do all the checks on the translated messages.
				if (locale !== defaultLocale) {
					let translatedVariables;

					try {
						translatedVariables = extractVariableNamesFromMessage(value);
					} catch (err: unknown) {
						problemStore.report(
							getInvalidVariableSyntaxProblem({
								key,
								locale,
								severity,
								ruleMeta,
								// TODO: highlight the area where the problem occured
								// since the error comes with location offsets where the error is found
								received: value,
								isIgnored,
							})
						);
					}

					const baseMessageHasVariables = Array.isArray(
						baseMessageVariables[key]
					);

					// Check if this translated key is expected to have variables
					if (baseMessageHasVariables) {
						for (let baseMessageVariable of baseMessageVariables[key]) {
							if (
								!translatedVariables ||
								!translatedVariables?.includes(baseMessageVariable)
							) {
								problemStore.report(
									getMissingVariableFromSourceProblem({
										key,
										locale,
										severity,
										ruleMeta,
										expected: baseMessageVariable,
										received: translatedVariables ?? "",
										isIgnored,
									})
								);
							}
						}
					}

					// Check if the translated file has variables not defined in the base message
					translatedVariables &&
						translatedVariables.forEach((translatedVariable) => {
							if (
								!Array.isArray(baseMessageVariables[key]) ||
								(Array.isArray(baseMessageVariables[key]) &&
									!baseMessageVariables[key].includes(translatedVariable))
							) {
								problemStore.report(
									getMismatchedVariableFromSourceProblem({
										key,
										locale,
										severity,
										ruleMeta,
										expected: baseMessageVariables[key] ?? "",
										received: translatedVariable,
										isIgnored,
									})
								);
							}
						});
				}
			}
		}
	},
};

export { noInvalidVariables };
