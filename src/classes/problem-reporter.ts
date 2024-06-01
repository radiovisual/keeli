import { SEVERITY_LEVEL } from "../constants.ts";
import { Problem } from "../types.ts";

export class ProblemReporter {
	private problems: Problem[];
	private errorCount = 0;
	private warningCount = 0;

	constructor() {
		this.problems = [];
	}

	report(problem: Problem) {
		this.problems.push(problem);

		if (problem.severity === SEVERITY_LEVEL.error) {
			this.errorCount += 1;
		}

		if (problem.severity === SEVERITY_LEVEL.warn) {
			this.warningCount += 1;
		}
	}

	getProblems() {
		return this.problems;
	}

	getErrorCount() {
		return this.errorCount;
	}

	getWarningCount() {
		return this.warningCount;
	}
}
