import { validSeverities } from "../../constants.ts";
import {
	Config,
	Rule,
	RuleContext,
	RuleMeta,
	TranslationFiles,
} from "../../types.ts";
import { getInvalidSeverityProblem } from "./problems.ts";

const ruleMeta: RuleMeta = {
	name: "no-invalid-severity",
	description: `Rule severity values must a string of: ${validSeverities.join(
		"|"
	)}.`,
	url: "TBD",
	type: "configuration",
	defaultSeverity: "error",
};

const noInvalidSeverity: Rule = {
	meta: ruleMeta,
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore,
		context: RuleContext
	) => {
		const { severity } = context;

		// Look for invalid rule severity in the configuration file
		Object.entries(config.rules).forEach(([rule, ruleSeverity]) => {
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
