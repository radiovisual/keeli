import { SEVERITY_LEVEL } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import { getMessageHasHtml } from "../../utils/message-helpers.ts";

import { getHtmlFoundInMessageProblem } from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-html-messages",
	description: `HTML syntax is not allowed in the messages.`,
	url: "TBD",
	type: "validation",
	defaultSeverity: "error",
};

const noHtmlMessages: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemReporter,
		context: RuleContext
	) => {
		const { severity, ignoreKeys } = context;

		if (severity === SEVERITY_LEVEL.off) {
			return;
		}

		for (let [locale, data] of Object.entries(translationFiles)) {
			for (let [key, message] of Object.entries(data)) {
				const shouldIgnore = ignoreKeys.includes(key);

				if (getMessageHasHtml(message)) {
					problemReporter.report(
						getHtmlFoundInMessageProblem({
							severity,
							locale,
							ruleMeta,
							key,
						}),
						shouldIgnore
					);
				}
			}
		}
	},
};

export { noHtmlMessages };
