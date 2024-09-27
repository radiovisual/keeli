import { createMockProblemReporter } from "../../utils/test-helpers.js";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noHtmlMessages } from "./no-html-messages.js";
import { getHtmlFoundInMessageProblem } from "./problems.js";

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
		const problemStore = createMockProblemReporter();

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

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const expected2 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const expected3 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const expected4 = getHtmlFoundInMessageProblem({
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
				greeting: "[EN] <b>{firstName}</b>",
				farewell: "[EN] <b>{firstName}</b>",
			},
			fr: {
				greeting: "[FR] <b>{firstName}</b>",
				farewell: "[FR] <b>{firstName}</b>",
			},
		};

		const ignored1 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored2 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored3 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored4 = getHtmlFoundInMessageProblem({
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

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

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

		const expected1 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const expected2 = getHtmlFoundInMessageProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const ignored1 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored2 = getHtmlFoundInMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell"],
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		expect(problemStore.report).toHaveBeenCalledWith(ignored1);
		expect(problemStore.report).toHaveBeenCalledWith(ignored2);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
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
			greeting: "[EN] <b>{firstName}</b>",
			farewell: "[EN] <b>{firstName}</b>",
		},
		fr: {
			greeting: "[FR] <b>{firstName}</b>",
			farewell: "[FR] <b>{firstName}</b>",
		},
	};

	rule.run(translationFiles, baseConfig, problemStore, context);
	expect(problemStore.report).not.toHaveBeenCalled();
});
