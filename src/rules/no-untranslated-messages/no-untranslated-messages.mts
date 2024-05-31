import { Problem } from "../../classes/problem.class.mts";
import {
  Config,
  Rule,
  RuleContext,
  RuleMeta,
  TranslationFiles,
} from "../../types.mjs";

const ruleMeta: RuleMeta = {
  name: "no-untranslated-messages",
  description: `All messages in the translation files must be translated.`,
  url: "TBD",
  type: "validation",
  defaultSeverity: "error",
};

const noUntranslatedMessages: Rule = {
  meta: ruleMeta,
  run: (
    translationFiles: TranslationFiles,
    config: Config,
    problemReporter,
    context: RuleContext
  ) => {
    const { defaultLocale } = config;
    const { severity } = context;
    const baseLocale = translationFiles[config.defaultLocale];

    for (let [locale, data] of Object.entries(translationFiles)) {
      if (locale !== defaultLocale) {
        for (let [translatedKey, translatedMessage] of Object.entries(data)) {
          const baseMessage = baseLocale[translatedKey];

          if (baseMessage === translatedMessage) {
            const problem = Problem.Builder.withRuleMeta(ruleMeta)
              .withSeverity(severity)
              .withLocale(locale)
              .withMessage(
                `Untranslated message found for key: ${translatedKey}`
              )
              .build();

            problemReporter.report(problem);
          }
        }
      }
    }
  },
};

export { noUntranslatedMessages };
