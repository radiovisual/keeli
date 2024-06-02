import { createMockProblemReporter } from "../../tests/utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noHtmlMessages } from "./no-html-messages.ts";
import { getHtmlFoundInMessageProblem } from "./problems.ts";

const ruleMeta = noHtmlMessages.meta;
const rule = noHtmlMessages;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-html-messages": "error",
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
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] <b>{firstName}</b>",
				farewell: "[EN] </b>{firstName}</b>",
			},
			fr: {
				greeting: "[FR] <b>{firstName}</b>",
				farewell: "[FR] <b>{firstName}</b>",
			},
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expectedProblem1 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
		});

		const expectedProblem2 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
		});

		const expectedProblem3 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const expectedProblem4 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(4);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem2);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem3);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem4);
	});

	it(`should ignore keys in ignoreKeys with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] <b>{firstName}</b>",
				farewell: "[EN] </b>{firstName}</b>",
			},
			fr: {
				greeting: "[FR] <b>{firstName}</b>",
				farewell: "[FR] <b>{firstName}</b>",
			},
		};

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "greeting"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).not.toHaveBeenCalled();
	});

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] <b>{firstName}</b>",
				farewell: "[EN] <b>{firstName}</b>",
			},
			fr: {
				greeting: "[FR] <b>{firstName}</b>",
				farewell: "[FR] <b>{firstName}</b>",
			},
		};

		const expectedProblem1 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const expectedProblem2 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
		});

		const ignoredProblem1 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
		});

		const ignoredProblem2 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem1);
		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem2);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem2);
	});
});

describe(`${rule.meta.name}: off`, () => {
	const problemReporter = createMockProblemReporter();

	const context: RuleContext = {
		severity: "off",
		ignoreKeys: [],
	};

	const translationFiles: TranslationFiles = {
		en: {
			greeting: "[EN] <b>{firstName}</b>",
			farewell: "[EN] <b>{firstName}</b>",
		},
		fr: {
			greeting: "[FR] <b>{firstName}</b>",
			farewell: "[FR] <b>{firstName}</b>",
		},
	};

	rule.run(translationFiles, baseConfig, problemReporter, context);
	expect(problemReporter.report).not.toHaveBeenCalled();
});
