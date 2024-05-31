import { ProblemReporter } from "../../classes/problem-reporter.mts";

export const createMockProblemReporter = () => {
  return {
    report: jest.fn(),
  } as unknown as ProblemReporter;
};
