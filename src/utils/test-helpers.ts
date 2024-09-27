import { ProblemStore } from "../classes/problem-store.class.ts";

export const createMockProblemReporter = () => {
	return {
		report: jest.fn(),
	} as unknown as ProblemStore;
};
