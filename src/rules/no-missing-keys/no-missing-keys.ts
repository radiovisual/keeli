import { SEVERITY_LEVEL } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import {
	getUnexpectedKeyFoundProblem,
	getMissingExpectedKeyFoundProblem,
} from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-missing-keys",
	description: `All keys declared in the source file are the only keys allowed in the translation files.`,
	url: "TBD",
	type: "validation",
	defaultSeverity: "error",
};

const noMissingKeys: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemReporter,
		context: RuleContext
	) => {
		const { defaultLocale } = config;
		const { severity } = context;
		const baseLocale = translationFiles[config.defaultLocale];

		if (severity === SEVERITY_LEVEL.off) {
			return;
		}

		// Extract the key strings from the baseMessages file
		const baseMessageKeys = Object.keys(baseLocale);

		const localesToCheck = Object.keys(translationFiles).filter(
			(locale) => locale !== defaultLocale
		);

		// Check for keys in the translation files that don't exist in the base file
		localesToCheck.forEach((locale) => {
			for (let key of Object.keys(translationFiles[locale])) {
				if (!baseMessageKeys.includes(key)) {
					problemReporter.report(
						getUnexpectedKeyFoundProblem({
							key,
							locale,
							severity,
							ruleMeta,
						})
					);
				}
			}
		});

		// Check for expected base file keys that are missing from the translation file
		localesToCheck.forEach((locale) => {
			const translationKeys = Object.keys(translationFiles[locale]);

			for (let baseKey of baseMessageKeys) {
				if (!translationKeys.includes(baseKey)) {
					problemReporter.report(
						getMissingExpectedKeyFoundProblem({
							key: baseKey,
							locale,
							severity,
							ruleMeta,
						})
					);
				}
			}
		});
	},
};

export { noMissingKeys };
