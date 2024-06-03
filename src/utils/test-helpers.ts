import { ProblemReporter } from "../classes/problem-reporter";

export const createMockProblemReporter = () => {
	return {
		report: jest.fn(),
	} as unknown as ProblemReporter;
};
