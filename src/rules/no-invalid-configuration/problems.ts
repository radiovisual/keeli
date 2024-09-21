import { Problem } from "../../classes/problem.class.ts";
import { RuleMeta, RuleSeverity } from "../../types.ts";

type ProblemContext = {
	severity: RuleSeverity;
	ruleMeta: RuleMeta;
};

export function getMissingDefaultLocaleProblem(
	problemContext: ProblemContext
): Problem {
	const { severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withMessage(`Missing 'defaultLocale' assignment in the configuration file`)
		.build();
}

export function getMissingSourceFileProblem(
	problemContext: ProblemContext
): Problem {
	const { severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withMessage(`Missing 'sourceFile' assignment in the configuration file`)
		.build();
}

export function getInvalidTranslationFilesProblem(
	problemContext: ProblemContext
): Problem {
	const { severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withMessage(
			`Invalid or missing configuration for 'translationsFile'. Check the syntax and/or remove empty values`
		)
		.build();
}

export function getInvalidPathToTranslatedFilesProblem(
	problemContext: ProblemContext
): Problem {
	const { severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withMessage(
			`Invalid or missing configuration for 'pathToTranslatedFiles'. Supply a path string`
		)
		.build();
}
