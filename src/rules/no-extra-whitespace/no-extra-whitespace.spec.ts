import { createMockProblemReporter } from "../../utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noExtraWhitespace } from "./no-extra-whitespace.ts";
import { getExtraWhitespaceFoundInMessageProblem } from "./problems.ts";

const ruleMeta = noExtraWhitespace.meta;
const rule = noExtraWhitespace;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-extra-whitespace": "error",
	},
	dryRun: false,
	enabled: true,
};

describe.each([["error"], ["warning"]])(`${rule.meta.name}`, (severityStr) => {
	const severity = severityStr as unknown as RuleSeverity;

	const context: RuleContext = {
		severity,
		ignoreKeys: [],
	};

	it(`should report html in messages with ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "   [EN] hello   ",
				farewell: "[EN]       goodbye",
			},
			fr: {
				greeting: "   [FR] hello   ",
				farewell: "[FR]       goodbye",
			},
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getExtraWhitespaceFoundInMessageProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const expected2 = getExtraWhitespaceFoundInMessageProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const expected3 = getExtraWhitespaceFoundInMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const expected4 = getExtraWhitespaceFoundInMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should ignore keys in ignoreKeys with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "   [EN] hello   ",
				farewell: "[EN]       goodbye",
			},
			fr: {
				greeting: "   [FR] hello   ",
				farewell: "[FR]       goodbye",
			},
		};

		const ignored1 = getExtraWhitespaceFoundInMessageProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored2 = getExtraWhitespaceFoundInMessageProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored3 = getExtraWhitespaceFoundInMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored4 = getExtraWhitespaceFoundInMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "greeting"],
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		expect(problemStore.report).toHaveBeenCalledWith(ignored1);
		expect(problemStore.report).toHaveBeenCalledWith(ignored2);
		expect(problemStore.report).toHaveBeenCalledWith(ignored3);
		expect(problemStore.report).toHaveBeenCalledWith(ignored4);
	});
});

describe(`${rule.meta.name}: off`, () => {
	const problemStore = createMockProblemReporter();

	const context: RuleContext = {
		severity: "off",
		ignoreKeys: [],
	};

	const translationFiles: TranslationFiles = {
		en: {
			greeting: "   [EN] hello   ",
			farewell: "[EN]       goodbye",
		},
		fr: {
			greeting: "   [FR] hello   ",
			farewell: "[FR]       goodbye",
		},
	};

	rule.run(translationFiles, baseConfig, problemStore, context);
	expect(problemStore.report).not.toHaveBeenCalled();
});
