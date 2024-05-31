import type { Config, Rule, TranslationFiles } from "../types.mts";
import * as rules from "../rules/index.mjs";
import { ProblemReporter } from "../classes/problem-reporter.mts";
import { getRuleSeverity } from "../utils/rules-helpers.mts";
import { SEVERITY_LEVEL } from "../constants.mts";
import { loadLanguageFiles } from "../utils/file-helpers.mts";

function runRules(config: Config) {
  const problemReporter = new ProblemReporter();
  const languageFiles = loadLanguageFiles(config) as TranslationFiles;
  console.log({ languageFiles, rules });

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
