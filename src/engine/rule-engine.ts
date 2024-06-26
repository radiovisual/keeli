import chalk from "chalk";
import type { Config, Rule, TranslationFiles } from "../types";
import * as rules from "../rules/index.js";
import { ProblemStore } from "../classes/problem-store.class.js";
import { getRuleIgnoreKeys, getRuleSeverity } from "../utils/rules-helpers";
import { RULE_TYPE, SEVERITY_LEVEL } from "../constants";
import { loadLanguageFiles } from "../utils/file-helpers";
import { Logger } from "../classes/logger.class";

function runRules(config: Config) {
	const problemStore = new ProblemStore();
	const languageFiles = loadLanguageFiles(config) as TranslationFiles;

	const configurationRules = Object.values(rules).filter(
		(rule: Rule) => rule.meta.type === RULE_TYPE.configuration
	);

	const validationRules = Object.values(rules).filter(
		(rule: Rule) => rule.meta.type === RULE_TYPE.validation
	);

	// Configuration rules always run first because if we find problems with the configuration, we abort.
	configurationRules.forEach((rule) => {
		const severity = getRuleSeverity(config, rule);
		const ignoreKeys = getRuleIgnoreKeys(config, rule);

		rule.run(languageFiles, config, problemStore, {
			ignoreKeys,
			severity,
		});
	});

	if (problemStore.getConfigurationProblemCount() > 0) {
		exitRun(problemStore, config.dryRun);
		return;
	}

	validationRules.forEach((rule) => {
		const severity = getRuleSeverity(config, rule);
		const ignoreKeys = getRuleIgnoreKeys(config, rule);

		if (severity !== SEVERITY_LEVEL.off) {
			rule.run(languageFiles, config, problemStore, {
				ignoreKeys,
				severity,
			});
		}
	});

	exitRun(problemStore, config.dryRun);
}

function exitRun(problemStore: ProblemStore, isDryRun: boolean) {
	const problems = problemStore.getProblems();

	const hasErrors = problems.length > 0;

	const logger = new Logger(problemStore);

	logger.logErrors();

	if (hasErrors && !isDryRun) {
		process.exit(1);
	} else if (hasErrors && isDryRun) {
		process.exit(0);
	}

	process.exit(0);
}

export { runRules };
