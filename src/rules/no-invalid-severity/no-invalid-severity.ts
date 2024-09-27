import { validSeverities } from "../../constants.js";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.js";
import { getInvalidSeverityProblem } from "./problems.js";

const ruleMeta: RuleMeta = {
	name: "no-invalid-severity",
	description: `Rule severity values must a string of: ${validSeverities.join(
		"|"
	)}.`,
	url: "https://github.com/radiovisual/keeli/tree/main/src/rules/no-invalid-severity",
	type: "configuration",
	defaultSeverity: "error",
	configurable: false,
};

const noInvalidSeverity: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore,
		context: RuleContext
	) => {
		const severity = ruleMeta.defaultSeverity;

		// Look for invalid rule severity in the configuration file
		Object.entries(config.rules).forEach(([rule, ruleValue]) => {
			let ruleSeverity;

			if (typeof ruleValue === "string") {
				ruleSeverity = ruleValue;
			} else if (typeof ruleValue === "object") {
				ruleSeverity = ruleValue?.severity;
			}

			if (!validSeverities.includes(ruleSeverity as string)) {
				const problem = getInvalidSeverityProblem(
					{ severity, ruleMeta },
					ruleSeverity as string,
					rule
				);

				problemStore.report(problem);
			}
		});
	},
};

export { noInvalidSeverity };
