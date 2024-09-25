import { Problem } from "../../classes/problem.class.ts";
import { RuleMeta, RuleSeverity } from "../../types.ts";

type ProblemContext = {
	key: string;
	locale: string;
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
	isIgnored?: boolean;
};

export function getExtraWhitespaceFoundInMessageProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, isIgnored } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withIsIgnored(isIgnored)
		.withMessage(`Extra whitespace found in message for key: ${key}`)
		.build();
}
