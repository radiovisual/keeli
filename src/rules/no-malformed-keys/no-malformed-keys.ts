import { SEVERITY_LEVEL, keyNamingConventions } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleConfigEntry,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import {
	isCamelCase,
	isKebabCase,
	isPascalCase,
	isSnakeCase,
} from "../../utils/string-helpers.ts";
import { getMalformedKeyFoundProblem } from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-malformed-keys",
	description: `All keys in the translation files must use a consistent naming convention.`,
	url: "TBD",
	type: "validation",
	defaultSeverity: "error",
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
			// is valid, otherwise the problem would have ben caught when the configuration rules run.
			if (validationFunctionPath) {
				// Load the function at the provided validationFunctionPath
				validationFunction = require(validationFunctionPath);
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

				if (!validationFunction(key)) {
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
