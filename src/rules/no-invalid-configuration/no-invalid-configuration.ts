import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import { isEmptyString } from "../../utils/string-helpers.ts";
import {
	configurableRuleNames,
	unConfigurableRuleNames,
} from "../../constants.ts";
import {
	getInvalidTranslationFilesProblem,
	getMissingSourceFileProblem,
	getMissingDefaultLocaleProblem,
	getInvalidPathToTranslatedFilesProblem,
	getUnknownRuleConfigurationProblem,
	getUnConfigurableRuleFoundInConfigProblem,
} from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-invalid-configuration",
	description: `A configuration file must be supplied with all required fields.`,
	url: "https://github.com/radiovisual/keeli/tree/main/src/rules/no-invalid-configuration",
	type: "configuration",
	defaultSeverity: "error",
	configurable: false,
};

const noInvalidConfiguration: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore,
		context: RuleContext
	) => {
		const { defaultLocale, sourceFile, pathToTranslatedFiles } = config;
		const severity = ruleMeta.defaultSeverity;

		// Look for missing or invalid 'defaultLocale' in the configuration
		if (!defaultLocale || isEmptyString(defaultLocale)) {
			problemStore.report(
				getMissingDefaultLocaleProblem({ ruleMeta, severity })
			);
		}

		// Look for missing or invalid 'sourceFile' in the configuration
		if (!sourceFile || isEmptyString(sourceFile)) {
			problemStore.report(getMissingSourceFileProblem({ ruleMeta, severity }));
		}

		// Look for missing or invalid 'translationFiles' in the configuration
		const translationFileEntries = Array.from(
			Object.entries(config?.translationFiles ?? {})
		);

		if (
			!config?.translationFiles ||
			typeof config.translationFiles !== "object" ||
			translationFileEntries.length === 0 ||
			(typeof config?.translationFiles === "object" &&
				!translationFileEntries.every(([locale, filename]) => {
					return (
						typeof locale === "string" &&
						typeof filename === "string" &&
						!isEmptyString(locale) &&
						!isEmptyString(filename)
					);
				}))
		) {
			problemStore.report(
				getInvalidTranslationFilesProblem({ ruleMeta, severity })
			);
		}

		// Look for missing or invalid 'pathToTranslatedFiles' in the configuration
		if (!pathToTranslatedFiles || isEmptyString(pathToTranslatedFiles)) {
			problemStore.report(
				getInvalidPathToTranslatedFilesProblem({ ruleMeta, severity })
			);
		}

		// Look for unexpected rule names in the configuration
		Object.keys(config?.rules).forEach((ruleName) => {
			if (
				!configurableRuleNames.includes(ruleName) &&
				!unConfigurableRuleNames.includes(ruleName)
			) {
				const problem = getUnknownRuleConfigurationProblem(
					{ ruleMeta, severity },
					ruleName
				);
				problemStore.report(problem);
			}
		});

		// Look for un-configurable rule names in the configuration
		Object.keys(config?.rules).forEach((ruleName) => {
			if (unConfigurableRuleNames.includes(ruleName)) {
				const problem = getUnConfigurableRuleFoundInConfigProblem(
					{ ruleMeta, severity },
					ruleName
				);
				problemStore.report(problem);
			}
		});
	},
};

export { noInvalidConfiguration };
