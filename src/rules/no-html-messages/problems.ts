import { Problem } from "../../classes/problem.class";
import { RuleMeta, RuleSeverity } from "../../types";

type ProblemContext = {
	key: string;
	locale: string;
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
	isIgnored?: boolean;
};

export function getHtmlFoundInMessageProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, isIgnored } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withIsIgnored(isIgnored)
		.withMessage(`HTML syntax found in message for key: ${key}`)
		.build();
}
