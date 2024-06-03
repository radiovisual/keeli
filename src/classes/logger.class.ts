import { ProblemStore } from "./problem-store.class.ts";
import { Problem } from "./problem.class.ts";

class Logger {
	private problemStore: ProblemStore;
	private validationProblems: Problem[];
	private configurationProblems: Problem[];
	private ignoredConfigurationProblems: Problem[];
	private ignoredValidationProblems: Problem[];

	public constructor(problemStore: ProblemStore) {
		this.problemStore = problemStore;
		this.validationProblems = problemStore.getValidationProblems();
		this.configurationProblems = problemStore.getConfigurationProblems();
		this.ignoredConfigurationProblems =
			problemStore.getIgnoredConfigurationProblems();
		this.ignoredValidationProblems =
			problemStore.getIgnoredValidationProblems();
	}

	// TODO: Clean up this summary when the pretty reporter is done https://github.com/radiovisual/i18n-validator/issues/3
	public logErrors() {
		this.problemStore.getAllProblems().forEach((problem) => {
			console.log(`${problem.severity} | ${problem.locale} ${problem.message}`);
		});
		console.log("---");
		console.log(this.getPrintSummary());
	}

	// TODO: Clean up this summary when the pretty reporter is done https://github.com/radiovisual/i18n-validator/issues/3
	public getPrintSummary() {
		let summary = ["\n"];

		summary.push(`Error(s) found: ${this.problemStore.getErrorCount()}`);

		if (this.problemStore.getIgnoredConfigurationProblemsCount() > 0) {
			summary.push(
				`Ignored Configuration Errors(s): ${this.problemStore.getIgnoredConfigurationProblemsCount()}`
			);
		}

		if (this.problemStore.getIgnoredValidationProblemsCount() > 0) {
			summary.push(
				`Ignored Validation Errors(s): ${this.problemStore.getIgnoredValidationProblemsCount()}`
			);
		}

		if (this.problemStore.getIgnoredErrorCount() > 0) {
			summary.push(
				`Ignored Errors: ${this.problemStore.getIgnoredErrorCount()}`
			);
		}

		summary.push(`Warnings(s) found: ${this.problemStore.getWarningCount()}`);

		if (this.problemStore.getIgnoredWarningCount() > 0) {
			summary.push(
				`Ignored Warnings: ${this.problemStore.getIgnoredWarningCount()}`
			);
		}

		return summary.join("\n");
	}
}

export { Logger };
