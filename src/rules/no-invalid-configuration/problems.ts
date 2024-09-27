import { Problem } from "../../classes/problem.class.js";
import { RuleMeta, RuleSeverity } from "../../types.js";

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

export function getUnknownRuleConfigurationProblem(
	problemContext: ProblemContext,
	unknownRuleName: string
): Problem {
	const { severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withMessage(
			`Unknown rule '${unknownRuleName}' found in configuration. Remove or update the rule entry.`
		)
		.build();
}

export function getUnConfigurableRuleFoundInConfigProblem(
	problemContext: ProblemContext,
	ruleName: string
): Problem {
	const { severity, ruleMeta } = problemContext;

	return Problem.Builder.withRuleMeta(ruleMeta)
		.withRuleMeta(ruleMeta)
		.withSeverity(severity)
		.withMessage(
			`The rule '${ruleName}' is not configurable. Remove it from your config's "rules" section.`
		)
		.build();
}
