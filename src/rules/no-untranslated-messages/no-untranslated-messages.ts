import { SEVERITY_LEVEL } from "../../constants.js";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.js";
import { getUntranslatedMessageProblem } from "./problems.js";

const ruleMeta: RuleMeta = {
	name: "no-untranslated-messages",
	description: `All messages in the translation files must be translated.`,
	url: "https://github.com/radiovisual/keeli/tree/main/src/rules/no-untranslated-messages",
	type: "validation",
	defaultSeverity: "error",
	configurable: true,
};

const noUntranslatedMessages: Rule = {
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

		for (let [locale, data] of Object.entries(translationFiles)) {
			if (locale !== defaultLocale) {
				for (let [translatedKey, translatedMessage] of Object.entries(data)) {
					const isIgnored = ignoreKeys.includes(translatedKey);

					const baseMessage = baseLocale[translatedKey];

					if (baseMessage === translatedMessage) {
						const problem = getUntranslatedMessageProblem({
							key: translatedKey,
							locale,
							severity,
							ruleMeta,
							isIgnored,
						});

						problemStore.report(problem);
					}
				}
			}
		}
	},
};

export { noUntranslatedMessages };
