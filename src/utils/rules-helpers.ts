import type { Config, Rule, RuleSeverity } from "../types";

/**
 * Get the user-supplied (or default) configurued severity of a specific rule.
 * @param config
 * @param rule
 */
export function getRuleSeverity(config: Config, rule: Rule): RuleSeverity {
	return config.rules[rule.meta.name];
}
