import { SEVERITY_LEVEL } from "../../constants.js";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.js";
import { getMessageHasHtml } from "../../utils/message-helpers.js";

import { getHtmlFoundInMessageProblem } from "./problems.js";

const ruleMeta: RuleMeta = {
	name: "no-html-messages",
	description: `HTML syntax is not allowed in the messages.`,
	url: "https://github.com/radiovisual/keeli/tree/main/src/rules/no-html-messages",
	type: "validation",
	defaultSeverity: "error",
	configurable: true,
};

const noHtmlMessages: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore,
		context: RuleContext
	) => {
		const { severity, ignoreKeys } = context;

		if (severity === SEVERITY_LEVEL.off) {
			return;
		}

		for (let [locale, data] of Object.entries(translationFiles)) {
			for (let [key, message] of Object.entries(data)) {
				const isIgnored = ignoreKeys.includes(key);

				if (getMessageHasHtml(message)) {
					problemStore.report(
						getHtmlFoundInMessageProblem({
							severity,
							locale,
							ruleMeta,
							key,
							isIgnored,
						})
					);
				}
			}
		}
	},
};

export { noHtmlMessages };
