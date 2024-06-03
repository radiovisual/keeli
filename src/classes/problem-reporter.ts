import { RULE_TYPE, SEVERITY_LEVEL } from "../constants.ts";
import { Problem } from "../types.ts";

export class ProblemReporter {
	// Validation Problems
	private validationProblemsFound = 0;
	private validationProblems: Problem[];

	// Ignored Validation Problems
	private ignoredValidationProblemsFound = 0;
	private ignoredValidationProblems: Problem[];

	// Configuration Problems
	private configurationProblemsFound = 0;
	private configurationProblems: Problem[];

	// Ignored Configuration Problems
	private ignoredConfigurationProblemsFound = 0;
	private ignoredConfigurationProblems: Problem[];

	// Meta Counts
	private errorCount = 0;
	private warningCount = 0;
	private ignoredErrorCount = 0;
	private ignoredWarningCount = 0;
	private ignoredProblemsCount = 0;

	constructor() {
		this.validationProblems = [];
		this.configurationProblems = [];
		this.ignoredConfigurationProblems = [];
		this.ignoredValidationProblems = [];
	}

	report(problem: Problem, shouldIgnore = false) {
		if (shouldIgnore) {
			this.ignore(problem);
			return;
		}

		if (problem.severity === SEVERITY_LEVEL.error) {
			this.errorCount += 1;
		}

		if (problem.severity === SEVERITY_LEVEL.warn) {
			this.warningCount += 1;
		}

		if (problem.ruleMeta.type === RULE_TYPE.configuration) {
			this.configurationProblemsFound += 1;
			this.configurationProblems.push(problem);
		}

		if (problem.ruleMeta.type === RULE_TYPE.validation) {
			this.validationProblemsFound += 1;
			this.validationProblems.push(problem);
		}
	}

	ignore(problem: Problem) {
		this.ignoredProblemsCount += 1;

		if (problem.severity === SEVERITY_LEVEL.error) {
			this.ignoredErrorCount += 1;
		}

		if (problem.severity === SEVERITY_LEVEL.warn) {
			this.ignoredWarningCount += 1;
		}

		if (problem.ruleMeta.type === RULE_TYPE.configuration) {
			this.ignoredConfigurationProblemsFound += 1;
			this.ignoredConfigurationProblems.push(problem);
		}

		if (problem.ruleMeta.type === RULE_TYPE.validation) {
			this.ignoredValidationProblemsFound += 1;
			this.ignoredValidationProblems.push(problem);
		}
	}

	getProblems() {
		return [...this.validationProblems, ...this.configurationProblems];
	}

	getConfigurationProblems() {
		return this.configurationProblems;
	}

	getValidationProblems() {
		return this.validationProblems;
	}

	getErrorCount() {
		return this.errorCount;
	}

	getIgnoredValidationProblemsCount() {
		return this.ignoredValidationProblemsFound;
	}

	getIgnoredConfigurationProblemsCount() {
		return this.ignoredConfigurationProblemsFound;
	}

	getWarningCount() {
		return this.warningCount;
	}

	getConfigurationProblemCount() {
		return this.configurationProblemsFound;
	}

	getValidationProblemCount() {
		return this.validationProblemsFound;
	}
}
