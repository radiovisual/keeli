import { createMockProblemReporter } from "../../tests/utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noUntranslatedMessages } from "./no-untranslated-messages.ts";
import { getUntranslatedMessageProblem } from "./problems.ts";

const ruleMeta = noUntranslatedMessages.meta;
const rule = noUntranslatedMessages;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-untranslated-messages": "error",
	},
	dryRun: false,
	enabled: true,
};

describe.each([["error"], ["warning"]])(`${rule.meta.name}`, (severityStr) => {
	const severity = severityStr as unknown as RuleSeverity;

	const context: RuleContext = {
		severity,
	};

	it(`should report untranslated messages with ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "Goodbye" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expectedProblem = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
	});

	it("should not report translated messages", () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "Goodbye" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expectedProblem = getUntranslatedMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
		});

		expect(problemReporter.report).not.toHaveBeenCalledWith(expectedProblem);
	});
});

describe(`${rule.meta.name}: off`, () => {
	const problemReporter = createMockProblemReporter();

	const context: RuleContext = {
		severity: "off",
	};

	const translationFiles: TranslationFiles = {
		en: { greeting: "Hello", farewell: "Goodbye" },
		fr: { greeting: "Bonjour", farewell: "Goodbye" },
	};

	rule.run(translationFiles, baseConfig, problemReporter, context);
	expect(problemReporter.report).not.toHaveBeenCalled();
});
