import { Config, Rule } from "../types.mjs";
import * as fs from "node:fs";
import * as path from "node:path";

function loadRules(config: Config): Rule[] {
  const rules: Rule[] = [];

  const rulesDir = path.join(__dirname, "rules");
  fs.readdirSync(rulesDir).forEach((dir) => {
    const rulePath = path.join(rulesDir, dir);
    if (fs.statSync(rulePath).isDirectory()) {
      const rule = require(rulePath).default as Rule;
      if (config.rules[rule.meta.name] !== "off") {
        rules.push(rule);
      }
    }
  });

  return rules;
}

function runRules(config: Config) {
  const rules = loadRules(config);
  const sourceFilePath = path.join(
    config.pathToTranslatedFiles,
    config.sourceFile
  );
  const sourceFileContent = fs.readFileSync(sourceFilePath, "utf8");

  config.supportedTranslations.forEach((locale) => {
    const translatedFilePath = path.join(
      config.pathToTranslatedFiles,
      `${locale}.json`
    );
    const translatedFileContent = fs.readFileSync(translatedFilePath, "utf8");

    rules.forEach((rule) => {
      const problems = rule.run(translatedFileContent, config);
      problems.forEach((problem) => {
        const severity = config.rules[rule.meta.name];
        console.log(`${severity.toUpperCase()}: [${locale}] ${problem}`);
      });
    });
  });
}

export { runRules };
