import { SEVERITY_LEVEL } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import {
	getEmptySourceMessageProblem,
	getEmptyTranslatedMessageProblem,
} from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-empty-messages",
	description: `Checks for empty messages in translations.`,
	url: "TBD",
	type: "validation",
	defaultSeverity: "error",
	configurable: true,
};

const noEmptyMessages: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore,
		context: RuleContext
	) => {
		const { defaultLocale } = config;
		const { severity, ignoreKeys } = context;
		const baseLocale = translationFiles[defaultLocale];

		if (severity === SEVERITY_LEVEL.off) {
			return;
		}

		for (const [locale, data] of Object.entries(translationFiles)) {
			for (const [key, message] of Object.entries(data)) {
				const baseMessage = baseLocale[key] ? baseLocale[key].trim() : "";
				const isIgnored = ignoreKeys.includes(key);

				const hasEmptyBaseMessage = locale === defaultLocale && !baseMessage;
				const hasEmptyTranslation =
					locale !== defaultLocale && message.trim() === "";

				if (hasEmptyBaseMessage) {
					problemStore.report(
						getEmptySourceMessageProblem({
							key,
							locale,
							severity,
							ruleMeta,
							isIgnored,
						})
					);
				} else if (hasEmptyTranslation) {
					problemStore.report(
						getEmptyTranslatedMessageProblem({
							key,
							locale,
							severity,
							ruleMeta,
							isIgnored,
						})
					);
				}
			}
		}
	},
};

export { noEmptyMessages };
