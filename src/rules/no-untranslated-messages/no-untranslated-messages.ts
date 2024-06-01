import { SEVERITY_LEVEL } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import { getUntranslatedMessageProblem } from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-untranslated-messages",
	description: `All messages in the translation files must be translated.`,
	url: "TBD",
	type: "validation",
	defaultSeverity: "error",
};

const noUntranslatedMessages: Rule = {
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

		for (let [locale, data] of Object.entries(translationFiles)) {
			if (locale !== defaultLocale) {
				for (let [translatedKey, translatedMessage] of Object.entries(data)) {
					const baseMessage = baseLocale[translatedKey];

					if (baseMessage === translatedMessage) {
						const problem = getUntranslatedMessageProblem({
							key: translatedKey,
							locale,
							severity,
							ruleMeta,
						});

						problemReporter.report(problem);
					}
				}
			}
		}
	},
};

export { noUntranslatedMessages };
