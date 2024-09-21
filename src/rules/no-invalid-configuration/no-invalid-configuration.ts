import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import { isEmptyString } from "../../utils/string-helpers.ts";
import {
	getInvalidTranslationFilesProblem,
	getMissingSourceFileProblem,
	getMissingDefaultLocaleProblem,
	getInvalidPathToTranslatedFilesProblem,
} from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-invalid-configuration",
	description: `A configuration file must be supplied with all required fields.`,
	url: "TBD",
	type: "configuration",
	defaultSeverity: "error",
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
		const { severity } = context;

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
	},
};

export { noInvalidConfiguration };
