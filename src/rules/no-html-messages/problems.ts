import { Problem } from "../../classes/problem.class";
import { RuleMeta, RuleSeverity } from "../../types";

type ProblemContext = {
	key: string;
	locale: string;
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
};

export function getHtmlFoundInMessageProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withMessage(`HTML syntax found in message for key: ${key}`)
		.build();
}
