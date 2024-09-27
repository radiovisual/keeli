import type { Config, Rule, RuleMeta } from "../types.js";
import { getRuleSeverity, getRuleIgnoreKeys } from "./rules-helpers.js";

describe("getRuleSeverity", () => {
	it("should get ruleMeta.defaultSeverity if none is supplied", () => {
		const config: Partial<Config> = {
			rules: {},
		};

		const ruleMeta: RuleMeta = {
			type: "validation",
			description: "",
			url: "",
			defaultSeverity: "warn",
			name: "example-rule",
			configurable: true,
		};

		const rule: Partial<Rule> = {
			meta: ruleMeta,
		};

		expect(getRuleSeverity(config as Config, rule as Rule)).toBe("warn");
	});

	it("should favor user-supplied severity over default if supplied in simple config", () => {
		const name = "example-rule";

		const config: Partial<Config> = {
			rules: {
				[name]: "off",
			},
		};

		const ruleMeta: RuleMeta = {
			type: "validation",
			description: "",
			url: "",
			defaultSeverity: "error",
			name,
			configurable: true,
		};

		const rule: Partial<Rule> = {
			meta: ruleMeta,
		};

		expect(getRuleSeverity(config as Config, rule as Rule)).toEqual("off");
	});

	it("should favor user-supplied severity label if supplied in advanced config", () => {
		const name = "example-rule";

		const config: Partial<Config> = {
			rules: {
				[name]: {
					severity: "off",
				},
			},
		};

		const ruleMeta: RuleMeta = {
			type: "validation",
			description: "",
			url: "",
			defaultSeverity: "error",
			name,
			configurable: true,
		};

		const rule: Partial<Rule> = {
			meta: ruleMeta,
		};

		expect(getRuleSeverity(config as Config, rule as Rule)).toEqual("off");
	});
});

describe("getRuleIgnoreKeys", () => {
	it("should get user-supplied ignored keys if supplied", () => {
		const name = "example-rule";
		const ignoreKeys = ["foo", "bar"];

		const config: Partial<Config> = {
			rules: {
				[name]: {
					severity: "off",
					ignoreKeys,
				},
			},
		};

		const ruleMeta: RuleMeta = {
			type: "validation",
			description: "",
			url: "",
			defaultSeverity: "error",
			name,
			configurable: true,
		};

		const rule: Partial<Rule> = {
			meta: ruleMeta,
		};

		expect(getRuleIgnoreKeys(config as Config, rule as Rule)).toEqual(
			ignoreKeys
		);
	});

	it("should return an empty array if no ignoreKeys are supplied in advanced config", () => {
		const name = "example-rule";

		const config: Partial<Config> = {
			rules: {
				[name]: {
					severity: "off",
				},
			},
		};

		const ruleMeta: RuleMeta = {
			type: "validation",
			description: "",
			url: "",
			defaultSeverity: "error",
			name,
			configurable: true,
		};

		const rule: Partial<Rule> = {
			meta: ruleMeta,
		};

		expect(getRuleIgnoreKeys(config as Config, rule as Rule)).toEqual([]);
	});

	it("should return an empty array for simple configurations", () => {
		const name = "example-rule";

		const config: Partial<Config> = {
			rules: {
				[name]: "error",
			},
		};

		const ruleMeta: RuleMeta = {
			type: "validation",
			description: "",
			url: "",
			defaultSeverity: "error",
			name,
			configurable: true,
		};

		const rule: Partial<Rule> = {
			meta: ruleMeta,
		};

		expect(getRuleIgnoreKeys(config as Config, rule as Rule)).toEqual([]);
	});
});
