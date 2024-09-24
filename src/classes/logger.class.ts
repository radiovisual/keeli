import { ProblemStore } from "./problem-store.class.ts";
import { Problem } from "./problem.class.ts";
import Table, {
	HorizontalTableRow,
	VerticalTableRow,
	CrossTableRow,
	Cell,
} from "cli-table3";
import chalk from "chalk";
import { SEVERITY_LEVEL } from "../constants.ts";

class Logger {
	private problemStore: ProblemStore;
	private validationProblems: { [locale: string]: Problem[] };
	private configurationProblems: Problem[];
	private isDryRun: boolean;

	public constructor(problemStore: ProblemStore, isDryRun: boolean) {
		this.problemStore = problemStore;
		this.validationProblems = problemStore.getValidationProblems();
		this.configurationProblems = problemStore.getConfigurationProblems();
		this.isDryRun = isDryRun;
	}

	public logErrors() {
		Object.entries(this.validationProblems).forEach(
			([locale, problemArray]) => {
				const problemTable = this.getNewTable();
				console.log(`\n\nProblems found in locale: ${chalk.cyan(locale)}`);
				problemArray.forEach((problem) => {
					problemTable.push(this.getTableRow(problem));
				});
				console.log(problemTable.toString());
			}
		);

		const configTable = this.getNewTable();
		this.configurationProblems.forEach((problem) => {
			configTable.push(this.getTableRow(problem));
		});

		if (this.configurationProblems.length > 0) {
			console.log(`\n\nProblems found in ${chalk.cyan("configuration")}`);
			console.log(configTable.toString());
		}

		console.log(this.getPrintSummary());

		if (this.isDryRun) {
			console.log(
				chalk.cyan(`\n\ndryRun is enabled for keeli. Errors will not throw.`)
			);
		}
	}

	public getTableRow(problem: Problem): Array<Cell> {
		const {
			severity,
			isIgnored,
			ruleMeta,
			locale,
			message,
			expected,
			received,
		} = problem;

		let items: Array<
			string | HorizontalTableRow | VerticalTableRow | CrossTableRow | Cell
		> = [];
		let colSpan = 0;

		if (severity === SEVERITY_LEVEL.error) {
			if (isIgnored) {
				items.push(chalk.red.strikethrough("error"));
			} else {
				items.push(chalk.red("error"));
			}
		} else if (severity === SEVERITY_LEVEL.warn) {
			if (isIgnored) {
				items.push(chalk.yellow.strikethrough("warn"));
			} else {
				items.push(chalk.yellow("warn"));
			}
		}

		if (locale) {
			items.push(chalk.dim(locale));
			colSpan++;
		}

		let messageWitDiff = isIgnored
			? `${chalk.yellow("[ignored]")} ${message}`
			: message;

		if (expected || received) {
			messageWitDiff += "\n\n";
		}

		if (expected) {
			messageWitDiff += `${chalk.cyan("Expected")}: ${expected}\n`;
		}

		if (received) {
			messageWitDiff += `${chalk.magenta("Received")}: ${received}\n`;
		}

		items.push(messageWitDiff);
		items.push(ruleMeta.name);

		return items as Cell[];
	}

	public getNewTable(useBorders = true) {
		if (useBorders) {
			return new Table();
		}

		return new Table({
			chars: {
				top: "",
				"top-mid": "",
				"top-left": "",
				"top-right": "",
				bottom: "",
				"bottom-mid": "",
				"bottom-left": "",
				"bottom-right": "",
				left: "",
				"left-mid": "",
				mid: "",
				"mid-mid": "",
				right: "",
				"right-mid": "",
				middle: " ",
			},
			style: { "padding-left": 0, "padding-right": 0 },
		});
	}

	public getPrintSummary() {
		const summaryTable = this.getNewTable(false);

		const ignoredErrorCount = this.problemStore.getIgnoredErrorCount();
		const errorCount = this.problemStore.getErrorCount() + ignoredErrorCount;

		const ignoredWarningCount = this.problemStore.getIgnoredWarningCount();
		const warningCount =
			this.problemStore.getWarningCount() + ignoredWarningCount;

		const errorSummary = [chalk.red("Errors:"), chalk.red(errorCount)];

		if (ignoredErrorCount > 0) {
			errorSummary.push(
				`${chalk.dim.italic("(" + ignoredErrorCount + " ignored)")}`
			);
		}

		const warningSummary = [
			chalk.yellow("Warnings:"),
			chalk.yellow(warningCount),
		];

		if (ignoredWarningCount > 0) {
			warningSummary.push(
				`${chalk.dim.italic("(" + ignoredWarningCount + " ignored)")}`
			);
		}

		summaryTable.push(errorSummary);
		summaryTable.push(warningSummary);

		return `\n\n${summaryTable.toString()}`;
	}
}

export { Logger };
