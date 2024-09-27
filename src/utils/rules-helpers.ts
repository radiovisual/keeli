import { validSeverities } from "../constants.js";
import type { Config, Rule, RuleSeverity } from "../types.js";

/**
 * Get the user-supplied (or default) configured severity of a specific rule.
 * @param config
 * @param rule
 * @returns string
 */
export function getRuleSeverity(config: Config, rule: Rule): RuleSeverity {
	const isConfigurable = rule.meta.configurable;

	const ruleConfig = config.rules[rule.meta.name];

	if (!isConfigurable) {
		return rule.meta.defaultSeverity;
	}

	if (typeof ruleConfig === "string" && validSeverities.includes(ruleConfig)) {
		return ruleConfig;
	}

	if (
		typeof ruleConfig === "object" &&
		typeof ruleConfig?.severity === "string" &&
		validSeverities.includes(ruleConfig.severity)
	) {
		return ruleConfig.severity;
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
