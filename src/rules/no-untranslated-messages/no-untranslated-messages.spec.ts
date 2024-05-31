import { ProblemReporter } from "../../classes/problem-reporter.mts";
import { Problem } from "../../classes/problem.class.mts";
import {
  Config,
  RuleContext,
  RuleSeverity,
  TranslationFiles,
} from "../../types.mjs";
import { noUntranslatedMessages } from "./no-untranslated-messages.mts";

const ruleMeta = noUntranslatedMessages.meta;

describe("no-untranslated-messages", () => {
  const defaultLocale = "en";
  const translationFiles: TranslationFiles = {
    en: { greeting: "Hello", farewell: "Goodbye" },
    fr: { greeting: "Bonjour", farewell: "Goodbye" },
  };

  const baseConfig: Config = {
    defaultLocale,
    sourceFile: "en.json",
    supportedTranslations: ["fr"],
    pathToTranslatedFiles: "i18n",
    rules: {
      "no-untranslated-messages": "error",
    },
    dryRun: false,
    enabled: true,
  };

  const runRule = (severity: RuleSeverity) => {
    const problemReporter = {
      report: jest.fn(),
    } as unknown as ProblemReporter;

    const context: RuleContext = {
      severity,
    };

    noUntranslatedMessages.run(
      translationFiles,
      baseConfig,
      problemReporter,
      context
    );

    return problemReporter.report;
  };

  test.each(["error", "warning"])(
    "reports untranslated messages with severity %s",
    (severity) => {
      const report = runRule(severity as RuleSeverity);

      const expectedProblem = Problem.Builder.withRuleMeta(ruleMeta)
        .withSeverity(severity as RuleSeverity)
        .withLocale("fr")
        .withMessage("Untranslated message found for key: farewell")
        .build();

      expect(report).toHaveBeenCalledTimes(1);
      expect(report).toHaveBeenCalledWith(expectedProblem);
    }
  );

  test("does not report translated messages", () => {
    const report = runRule("error");

    expect(report).not.toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Untranslated message found for key: greeting",
      })
    );
  });
});
