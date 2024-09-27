import type { Config } from "../types.js";

import { getAllSupportedLocales } from "./config-helpers.js";

describe("getAllSupportedLocales", () => {
	it("should get all supported locales", () => {
		const config: Partial<Config> = {
			defaultLocale: "en",
			translationFiles: {
				fr: "fr.json",
				de: "de.json",
				it: "it.json",
			},
		};

		expect(getAllSupportedLocales(config as Config)).toMatchObject([
			"fr",
			"de",
			"it",
			"en",
		]);
	});

	it("should remove duplicates", () => {
		const config: Partial<Config> = {
			defaultLocale: "en",
			translationFiles: {
				fr: "fr.json",
				de: "de.json",
				it: "it.json",
				en: "en.json",
			},
		};

		expect(getAllSupportedLocales(config as Config)).toMatchObject([
			"fr",
			"de",
			"it",
			"en",
		]);
	});
});
