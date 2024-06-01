import type { Config } from "../types";

export function getAllSupportedLocales(config: Config): string[] {
	const allSupportedLocales = new Set([
		...Object.keys(config.translationFiles),
		config.defaultLocale,
	]);

	return Array.from(allSupportedLocales);
}
