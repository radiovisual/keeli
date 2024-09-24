import { RULE_TYPE, SEVERITY_LEVEL } from "../constants.ts";
import { Problem } from "../types.ts";

export class ProblemStore {
	// Validation Problems
	private validationErrorCount = 0;
	private validationProblems: { [locale: string]: Problem[] } = {};
	private validationWarningCount = 0;

	// Ignored Validation Problems
	private ignoredValidationErrorCount = 0;
	private ignoredValidationProblems: { [locale: string]: Problem[] } = {};

	// Configuration Problems
	private configurationErrorCount = 0;
	private configurationWarningCount = 0;
	private configurationErrors: Problem[];
	private configurationWarnings: Problem[];

	// Meta Counts
	private errorCount = 0;
	private warningCount = 0;
	private ignoredErrorCount = 0;
	private ignoredWarningCount = 0;
	private ignoredProblemsCount = 0;

	constructor() {
		this.validationProblems = {};
		this.configurationErrors = [];
		this.ignoredValidationProblems = {};
		this.configurationWarnings = [];
	}

	report(problem: Problem) {
		if (problem.isIgnored) {
			this.incrementIgnoreStats(problem);
		}

		if (problem.severity === SEVERITY_LEVEL.error) {
			this.errorCount += 1;
		}

		if (problem.severity === SEVERITY_LEVEL.warn) {
			this.warningCount += 1;
		}

		if (problem.ruleMeta.type === RULE_TYPE.configuration) {
			this.incrementConfigurationProblemStats(problem);
			this.registerConfigurationProblem(problem);
		}

		if (problem.ruleMeta.type === RULE_TYPE.validation) {
			this.incrementValidationProblemStats(problem);
			this.registerValidationProblem(problem);
		}
	}

	registerValidationProblem(problem: Problem) {
		if (problem.severity === SEVERITY_LEVEL.error) {
			this.validationErrorCount += 1;
		} else if (problem.severity === SEVERITY_LEVEL.warn) {
			this.validationWarningCount += 1;
		}

		if (!this.validationProblems?.[problem.locale]) {
			this.validationProblems[problem.locale] = [];
		}

		this.validationProblems[problem.locale].push(problem);
	}

	registerConfigurationProblem(problem: Problem) {
		if (problem.severity === SEVERITY_LEVEL.error) {
			this.configurationErrorCount += 1;
			this.configurationErrors.push(problem);
		} else if (problem.severity === SEVERITY_LEVEL.warn) {
			this.configurationWarningCount += 1;
			this.configurationWarnings.push(problem);
		}
	}

	incrementValidationProblemStats(problem: Problem) {
		this.validationErrorCount += 1;

		if (problem.severity === SEVERITY_LEVEL.error) {
			this.validationErrorCount += 1;
		} else if (problem.severity === SEVERITY_LEVEL.warn) {
			this.configurationWarningCount += 1;
		}
	}

	incrementConfigurationProblemStats(problem: Problem) {
		if (problem.severity === SEVERITY_LEVEL.error) {
			this.configurationErrorCount += 1;
		} else if (problem.severity === SEVERITY_LEVEL.warn) {
			this.configurationWarningCount += 1;
		}
	}

	incrementIgnoreStats(problem: Problem) {
		this.ignoredProblemsCount += 1;

		if (problem.severity === SEVERITY_LEVEL.error) {
			this.ignoredErrorCount += 1;
		}

		if (problem.severity === SEVERITY_LEVEL.warn) {
			this.ignoredWarningCount += 1;
		}

		if (problem.ruleMeta.type === RULE_TYPE.validation) {
			this.ignoredValidationErrorCount += 1;
		}
	}

	getIgnoredProblems() {
		return this.ignoredValidationProblems;
	}

	getIgnoredValidationProblems() {
		return this.ignoredValidationProblems;
	}

	getConfigurationProblems() {
		return [...this.configurationErrors, ...this.configurationWarnings];
	}

	getValidationProblems() {
		return this.validationProblems;
	}

	getErrorCount() {
		return this.errorCount;
	}

	getIgnoredErrorCount() {
		return this.ignoredErrorCount;
	}

	getIgnoredWarningCount() {
		return this.ignoredWarningCount;
	}

	getWarningCount() {
		return this.warningCount;
	}

	getIgnoredValidationErrorCount() {
		return this.ignoredValidationErrorCount;
	}

	getConfigurationErrorCount() {
		return this.configurationErrorCount;
	}

	getConfigurationWarningCount() {
		return this.configurationWarningCount;
	}

	getValidationProblemCount() {
		return this.validationErrorCount;
	}
}
