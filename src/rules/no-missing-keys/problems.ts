import { Problem } from "../../classes/problem.class";
import { RuleMeta, RuleSeverity } from "../../types";

type ProblemContext = {
	key: string;
	locale: string;
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
};

export function getUnexpectedKeyFoundProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withMessage(
			`Unexpected key found: '${key}'. This key is not in the source file`
		)
		.build();
}

export function getMissingExpectedKeyFoundProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withMessage(
			`Missing required key: '${key}'. This key is defined in the source file`
		)
		.build();
}
