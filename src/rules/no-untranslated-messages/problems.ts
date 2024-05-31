import { Problem } from "../../classes/problem.class.mts";
import { RuleMeta, RuleSeverity } from "../../types.mts";

type ProblemContext = {
  key: string;
  locale: string;
  severity: RuleSeverity;
  ruleMeta: RuleMeta;
};

export function getUntranslatedMessageProblem(
  problemContext: ProblemContext
): Problem {
  const { key, locale, severity, ruleMeta } = problemContext;

  return Problem.Builder.withRuleMeta(ruleMeta)
    .withSeverity(severity)
    .withLocale(locale)
    .withMessage(`Untranslated message found for key: ${key}`)
    .build();
}
