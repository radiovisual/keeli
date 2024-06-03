import { createMockProblemReporter } from "../../utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noInvalidVariables } from "./no-invalid-variables";
import {
	getMismatchedVariableFromSourceProblem,
	getMissingVariableFromSourceProblem,
	getInvalidVariableSyntaxProblem,
	getUnbalancedVariableBracketsSyntaxProblem,
} from "./problems.ts";

const ruleMeta = noInvalidVariables.meta;
const rule = noInvalidVariables;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json", de: "de.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-invalid-variables": "error",
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

	it(`should report missing variables in translation files with ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "[EN] {firstName}", farewell: "[EN] {firstName}" },
			fr: { greeting: "[FR]", farewell: "[FR]" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: false,
		});

		const expected2 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(2);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
	});

	it(`should report unexpected variables in translation files with ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "[EN]", farewell: "[EN]" },
			fr: {
				greeting: "[FR] {unexpectedVariable}",
				farewell: "[FR] {unexpectedVariable}",
			},
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getMismatchedVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "unexpectedVariable",
			isIgnored: false,
		});

		const expected2 = getMismatchedVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "unexpectedVariable",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(2);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
	});

	it(`should report malformed variables in translation files with ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] {expectedGreetingVariable}",
				farewell: "[EN] {expectedFarewellVariable}",
			},
			fr: {
				greeting: "[FR] {expectedGreetingVariable",
				farewell: "[FR] {expectedFarewellVariable}",
			},
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getUnbalancedVariableBracketsSyntaxProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: undefined,
			received: translationFiles.fr.greeting,
			isIgnored: false,
		});

		const expected2 = getInvalidVariableSyntaxProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: undefined,
			received: translationFiles.fr.greeting,
			isIgnored: false,
		});

		const expected3 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "expectedGreetingVariable",
			received: "",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(3);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
	});

	it(`should report unbalanced variable brackets in the source file with ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] {greetingName",
				farewell: "[EN] {farewellName",
			},
			fr: {
				greeting: "[FR] {greetingName}",
				farewell: "[FR] {farewellName}",
			},
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getUnbalancedVariableBracketsSyntaxProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			expected: undefined,
			received: "[EN] {greetingName",
			isIgnored: false,
		});

		const expected2 = getUnbalancedVariableBracketsSyntaxProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			expected: undefined,
			received: "[EN] {farewellName",
			isIgnored: false,
		});

		const expected3 = getMismatchedVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "greetingName",
			isIgnored: false,
		});

		const expected4 = getMismatchedVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "farewellName",
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
			en: { greeting: "[EN] {firstName}", farewell: "[EN] {firstName}" },
			fr: { greeting: "[FR]", farewell: "[FR]" },
		};

		const ignored1 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: true,
		});

		const ignored2 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: true,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "greeting"],
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		expect(problemStore.report).toHaveBeenCalledWith(ignored1);
		expect(problemStore.report).toHaveBeenCalledWith(ignored2);
	});

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] {firstName}",
				farewell: "[EN] {firstName}",
				chocolate: "[EN] {chocolate}",
			},
			fr: { greeting: "[FR]", farewell: "[FR]", chocolate: "[FR]" },
			de: { greeting: "[DE]", farewell: "[DE]", chocolate: "[DE]" },
		};

		const expected1 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: false,
		});

		const expected2 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "de",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: false,
		});

		const ignored1 = getMissingVariableFromSourceProblem({
			key: "chocolate",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "chocolate",
			received: "",
			isIgnored: true,
		});

		const ignored2 = getMissingVariableFromSourceProblem({
			key: "chocolate",
			locale: "de",
			severity,
			ruleMeta,
			expected: "chocolate",
			received: "",
			isIgnored: true,
		});

		const ignored3 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: true,
		});

		const ignored4 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "de",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
			isIgnored: true,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		expect(problemStore.report).toHaveBeenCalledWith(ignored1);
		expect(problemStore.report).toHaveBeenCalledWith(ignored2);
		expect(problemStore.report).toHaveBeenCalledWith(ignored3);
		expect(problemStore.report).toHaveBeenCalledWith(ignored4);
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
			a: "[EN] {a}",
			b: "[EN] {b}",
			c: "[EN] {c}",
		},
		fr: { a: "[FR]", b: "[FR]", c: "[FR]" },
		de: { a: "[DE]", b: "[FR]", c: "[DE]" },
	};

	rule.run(translationFiles, baseConfig, problemStore, context);
	expect(problemStore.report).not.toHaveBeenCalled();
});
