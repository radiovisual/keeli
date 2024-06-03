import type { Config, Rule, TranslationFiles } from "../types";
import * as rules from "../rules/index.js";
import { ProblemReporter } from "../classes/problem-reporter.js";
import { getRuleIgnoreKeys, getRuleSeverity } from "../utils/rules-helpers";
import { RULE_TYPE, SEVERITY_LEVEL } from "../constants";
import { loadLanguageFiles } from "../utils/file-helpers";

function runRules(config: Config) {
	const problemReporter = new ProblemReporter();
	const languageFiles = loadLanguageFiles(config) as TranslationFiles;

	const configurationRules = Object.values(rules).filter(
		(rule: Rule) => rule.meta.type === RULE_TYPE.configuration
	);

	const validationRules = Object.values(rules).filter(
		(rule: Rule) => rule.meta.type === RULE_TYPE.validation
	);

	console.log({ configurationRules, validationRules });
	configurationRules.forEach((rule) => {
		const severity = getRuleSeverity(config, rule);
		const ignoreKeys = getRuleIgnoreKeys(config, rule);

		rule.run(languageFiles, config, problemReporter, {
			ignoreKeys,
			severity,
		});
	});

	if (problemReporter.getProblems().length > 0) {
		// TODO: send config problems to the problem logger, respecting the dryRun
		console.log("Config problems found", problemReporter.getProblems());
		return;
	}

	validationRules.forEach((rule) => {
		const severity = getRuleSeverity(config, rule);
		const ignoreKeys = getRuleIgnoreKeys(config, rule);

		if (severity !== SEVERITY_LEVEL.off) {
			rule.run(languageFiles, config, problemReporter, {
				ignoreKeys,
				severity,
			});
		}
	});

	// TODO: send validation problems to the problem logger, respecting the dryRun
	console.log("Validation problems found", problemReporter.getProblems());
}

export { runRules };
