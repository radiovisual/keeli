import { SEVERITY_LEVEL } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import {
	stringHasExtraneousWhitespace,
	stringHasWhitespacePadding,
} from "../../utils/string-helpers.ts";

import { getExtraWhitespaceFoundInMessageProblem } from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-extra-whitespace",
	description: `Whitespace should not appear before or after a message, or have more than 1 contiguous whitespace character internally.`,
	url: "TBD",
	type: "validation",
	defaultSeverity: "error",
};

const noExtraWhitespace: Rule = {
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

				if (
					stringHasExtraneousWhitespace(message) ||
					stringHasWhitespacePadding(message)
				) {
					problemStore.report(
						getExtraWhitespaceFoundInMessageProblem({
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

export { noExtraWhitespace };
