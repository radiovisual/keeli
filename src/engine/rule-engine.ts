import type { Config, TranslationFiles } from "../types";
import * as rules from "../rules/index.js";
import { ProblemReporter } from "../classes/problem-reporter.js";
import { getRuleSeverity } from "../utils/rules-helpers";
import { SEVERITY_LEVEL } from "../constants";
import { loadLanguageFiles } from "../utils/file-helpers";

function runRules(config: Config) {
	const problemReporter = new ProblemReporter();
	const languageFiles = loadLanguageFiles(config) as TranslationFiles;

	Object.values(rules).forEach((rule) => {
		const severity = getRuleSeverity(config, rule);

		if (severity !== SEVERITY_LEVEL.off) {
			rule.run(languageFiles, config, problemReporter, { severity });
		}
	});

	// TODO: send problems to the problem logger, respecting the dryRun
	console.log("Problems found", problemReporter.getProblems());
}

export { runRules };
