import type { Config, Rule, RuleSeverity } from "../types";

/**
 * Get the user-supplied (or default) configured severity of a specific rule.
 * @param config
 * @param rule
 * @returns string
 */
export function getRuleSeverity(config: Config, rule: Rule): RuleSeverity {
	const ruleConfig = config.rules[rule.meta.name];

	if (typeof ruleConfig === "string") {
		return ruleConfig;
	} else if (typeof ruleConfig === "object" && ruleConfig.severity) {
		ruleConfig.severity;
	}

	return rule.meta.defaultSeverity;
}

/**
 * Get the user-supplied ignoreKeys array of a specific rule.
 * @param config
 * @param rule
 * @returns string[]
 */
export function getRuleIgnoreKeys(config: Config, rule: Rule): string[] {
	const ruleConfig = config.rules[rule.meta.name];

	if (typeof ruleConfig === "object" && Array.isArray(ruleConfig.ignoreKeys)) {
		return ruleConfig.ignoreKeys;
	}

	return [];
}
