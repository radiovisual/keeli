import { Problem } from "../../classes/problem.class.js";
import { RuleMeta, RuleSeverity } from "../../types.js";
import { SEVERITY_LEVEL } from "../../constants.js";

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
			`Invalid severity: "${invalidSeverity}" assigned to ${ruleName}. Use: ${validSeverities.join(
				" | "
			)}`
		)
		.build();
}
