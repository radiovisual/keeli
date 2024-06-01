import { hasUnbalancedBrackets } from "./variable-helpers";

describe("hasUnbalancedBrackets", () => {
	it("should return true for strings with unbalanced brackets", () => {
		expect(hasUnbalancedBrackets("{")).toBe(true);
		expect(hasUnbalancedBrackets("}")).toBe(true);
		expect(hasUnbalancedBrackets("{}}")).toBe(true);
		expect(hasUnbalancedBrackets("{{}")).toBe(true);
		expect(hasUnbalancedBrackets("{{var}")).toBe(true);
		expect(hasUnbalancedBrackets("{var{var}")).toBe(true);
		expect(hasUnbalancedBrackets("text with variable}")).toBe(true);
		expect(hasUnbalancedBrackets("more text with variable}")).toBe(true);
		expect(hasUnbalancedBrackets("more text with {variable")).toBe(true);
	});

	it("should return false for strings without unbalanced brackets", () => {
		expect(hasUnbalancedBrackets("{}")).toBe(false);
		expect(hasUnbalancedBrackets("{{}}")).toBe(false);
		expect(hasUnbalancedBrackets("{{{var}}}")).toBe(false);
		expect(hasUnbalancedBrackets("{{{{()}}}}")).toBe(false);
		expect(hasUnbalancedBrackets("{{var}}")).toBe(false);
		expect(hasUnbalancedBrackets("{var}{var}")).toBe(false);
		expect(hasUnbalancedBrackets("text with {variable}")).toBe(false);
		expect(hasUnbalancedBrackets("more text with {variable}")).toBe(false);
	});
});
