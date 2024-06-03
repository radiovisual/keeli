import { RULE_TYPE, SEVERITY_LEVEL } from "../constants.ts";
import { Problem } from "../types.ts";

export class ProblemStore {
	// Validation Problems
	private validationProblemsCount = 0;
	private validationProblems: Problem[];

	// Ignored Validation Problems
	private ignoredValidationProblemsCount = 0;
	private ignoredValidationProblems: Problem[];

	// Configuration Problems
	private configurationProblemsCount = 0;
	private configurationProblems: Problem[];

	// Ignored Configuration Problems
	private ignoredConfigurationProblemsCount = 0;
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

	report(problem: Problem) {
		if (problem.isIgnored) {
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
			this.configurationProblemsCount += 1;
			this.configurationProblems.push(problem);
		}

		if (problem.ruleMeta.type === RULE_TYPE.validation) {
			this.validationProblemsCount += 1;
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
			this.ignoredConfigurationProblemsCount += 1;
			this.ignoredConfigurationProblems.push(problem);
		}

		if (problem.ruleMeta.type === RULE_TYPE.validation) {
			this.ignoredValidationProblemsCount += 1;
			this.ignoredValidationProblems.push(problem);
		}
	}

	getProblems() {
		return [...this.validationProblems, ...this.configurationProblems];
	}

	getAllProblems() {
		return [
			...this.validationProblems,
			...this.ignoredValidationProblems,
			...this.configurationProblems,
			...this.ignoredConfigurationProblems,
		];
	}

	getIgnoredProblems() {
		return [
			...this.ignoredValidationProblems,
			...this.ignoredConfigurationProblems,
		];
	}

	getIgnoredConfigurationProblems() {
		return this.ignoredConfigurationProblems;
	}

	getIgnoredValidationProblems() {
		return this.ignoredValidationProblems;
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

	getIgnoredErrorCount() {
		return this.ignoredErrorCount;
	}

	getIgnoredWarningCount() {
		return this.ignoredWarningCount;
	}

	getWarningCount() {
		return this.warningCount;
	}

	getIgnoredValidationProblemsCount() {
		return this.ignoredValidationProblemsCount;
	}

	getIgnoredConfigurationProblemsCount() {
		return this.ignoredConfigurationProblemsCount;
	}

	getConfigurationProblemCount() {
		return this.configurationProblemsCount;
	}

	getValidationProblemCount() {
		return this.validationProblemsCount;
	}
}
