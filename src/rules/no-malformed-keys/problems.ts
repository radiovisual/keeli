import { Problem } from "../../classes/problem.class.ts";
import { RuleMeta, RuleSeverity } from "../../types.ts";

type ProblemContext = {
	key: string;
	locale: string;
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
	isIgnored: boolean;
};

export function getMalformedKeyFoundProblem(
	problemContext: ProblemContext
): Problem {
	const { key, severity, ruleMeta, locale, isIgnored } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withIsIgnored(isIgnored)
		.withMessage(`Malformed key found: '${key}'.`)
		.build();
}
