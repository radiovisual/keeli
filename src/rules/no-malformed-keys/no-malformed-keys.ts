import { SEVERITY_LEVEL, keyNamingConventions } from "../../constants.js";
import {
	Config,
	Rule,
	RuleConfigEntry,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.js";
import {
	isCamelCase,
	isKebabCase,
	isPascalCase,
	isSnakeCase,
} from "../../utils/string-helpers.js";
import { getMalformedKeyFoundProblem } from "./problems.js";

const ruleMeta: RuleMeta = {
	name: "no-malformed-keys",
	description: `All keys in the translation files must use a consistent naming convention.`,
	url: "https://github.com/radiovisual/keeli/tree/main/src/rules/no-malformed-keys",
	type: "validation",
	defaultSeverity: "error",
	configurable: true,
};

const noMalformedKeys: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore,
		context: RuleContext
	) => {
		const { severity } = context;

		if (severity === SEVERITY_LEVEL.off) {
			return;
		}

		let _ignoreKeys: string[] = [];

		// The default naming convention for keeli is camel case
		let validationFunction: (key: string) => boolean = isCamelCase;

		let isUsingExternalValidation = false;

		const ruleConfigEntry: RuleConfigEntry = config.rules["no-malformed-keys"];

		if (typeof ruleConfigEntry === "object") {
			const { namingConvention, ignoreKeys, validationFunctionPath } =
				ruleConfigEntry;

			if (ignoreKeys) {
				_ignoreKeys = ignoreKeys;
			}

			// Check if the user provided their own validation function. If supplied.
			// this user-supplied validation function will be the only validation function that we run.
			// At this point, Keeli is already running, so we can assume the provided function
			// is valid, otherwise the problem would have been caught when the configuration rules run.
			if (validationFunctionPath) {
				// Load the function at the provided validationFunctionPath
				validationFunction = require(validationFunctionPath);
				isUsingExternalValidation = true;
			} else if (namingConvention) {
				if (namingConvention === keyNamingConventions.camelCase) {
					validationFunction = isCamelCase;
				} else if (namingConvention === keyNamingConventions.snakeCase) {
					validationFunction = isSnakeCase;
				} else if (namingConvention === keyNamingConventions.pascalCase) {
					validationFunction = isPascalCase;
				} else if (namingConvention === keyNamingConventions.kebabCase) {
					validationFunction = isKebabCase;
				}
			}
		}

		for (let [locale, data] of Object.entries(translationFiles)) {
			for (let key of Object.keys(data)) {
				const isIgnored = _ignoreKeys.includes(key);

				// if the key is period-delimited (and we are using one of keeli's internal key-naming conventions), then we need to check each period-delimited part of the key on its own
				if (!isUsingExternalValidation && key.indexOf(".") > -1) {
					const fullKey = key;
					const foundInvalidPart = key
						.split(".")
						.some((keyPart) => !validationFunction(keyPart));

					if (foundInvalidPart) {
						const problem = getMalformedKeyFoundProblem({
							key: fullKey,
							severity,
							ruleMeta,
							isIgnored,
							locale,
						});
						problemStore.report(problem);
					}
				} else if (!validationFunction(key)) {
					const problem = getMalformedKeyFoundProblem({
						key,
						severity,
						ruleMeta,
						isIgnored,
						locale,
					});
					problemStore.report(problem);
				}
			}
		}
	},
};

export { noMalformedKeys };
