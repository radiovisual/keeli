import { ProblemStore } from "../classes/problem-store.class";

export const createMockProblemReporter = () => {
	return {
		report: jest.fn(),
	} as unknown as ProblemStore;
};
