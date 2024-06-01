import { Problem } from "../../classes/problem.class";
import { RuleMeta, RuleSeverity } from "../../types";

type ProblemContext = {
	key: string;
	locale: string;
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
	expected?: string | object | number;
	received?: string | object | number;
};

export function getMissingVariableFromSourceProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, expected, received } =
		problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withMessage(`Missing variable for key: ${key}`)
		.withExpected(expected)
		.withReceived(received)
		.build();
}

export function getMismatchedVariableFromSourceProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, expected, received } =
		problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withMessage(`Unknown variable found in translation file for key: ${key}`)
		.withExpected(expected)
		.withReceived(received)
		.build();
}

export function getInvalidVariableSyntaxProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, received } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withMessage(`Invalid variable syntax found in key: ${key}`)
		.withReceived(received)
		.build();
}
