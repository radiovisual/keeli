import { Problem } from "../../classes/problem.class.ts";
import { RuleMeta, RuleSeverity } from "../../types.ts";
import { SEVERITY_LEVEL } from "../../constants.ts";

const validSeverities = Object.values(SEVERITY_LEVEL);

type ProblemContext = {
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
};

export function getInvalidSeverityProblem(
	problemContext: ProblemContext,
	invalidSeverity: string,
	ruleName: string
): Problem {
	const { severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withMessage(
			`Invalid severity: "${invalidSeverity}" assigned to ${ruleName}. You must use: ${validSeverities.join(
				"|"
			)}`
		)
		.build();
}
