import { Problem } from "../../classes/problem.class.js";
import { RuleMeta, RuleSeverity } from "../../types.js";

type ProblemContext = {
	key: string;
	locale: string;
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
	expected?: string | object | number;
	received?: string | object | number;
	isIgnored?: boolean;
};

export function getMissingVariableFromSourceProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, expected, received, isIgnored } =
		problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withMessage(`Missing variable for key: ${key}`)
		.withExpected(expected)
		.withIsIgnored(isIgnored)
		.withReceived(received)
		.build();
}

export function getMismatchedVariableFromSourceProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, expected, received, isIgnored } =
		problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withIsIgnored(isIgnored)
		.withMessage(`Unknown variable found in translation file for key: ${key}`)
		.withExpected(expected)
		.withReceived(received)
		.build();
}

export function getInvalidVariableSyntaxProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, received, isIgnored } =
		problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withIsIgnored(isIgnored)
		.withMessage(`Invalid variable syntax found in key: ${key}`)
		.withReceived(received)
		.build();
}

export function getUnbalancedVariableBracketsSyntaxProblem(
	problemContext: ProblemContext
): Problem {
	const { key, locale, severity, ruleMeta, received, isIgnored } =
		problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withLocale(locale)
		.withIsIgnored(isIgnored)
		.withMessage(`Unbalanced variable brackets found in key: ${key}`)
		.withReceived(received)
		.build();
}
