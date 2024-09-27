import { createMockProblemReporter } from "../../utils/test-helpers.js";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noMalformedKeys } from "./no-malformed-keys.js";
import { getMalformedKeyFoundProblem } from "./problems.js";

const ruleMeta = noMalformedKeys.meta;
const rule = noMalformedKeys;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json", de: "de.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-missing-keys": "error",
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

	it(`should report malformed key when namingConvention is camel-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				NOTCAMELCASE: "[EN] expected one",
				"not-camel-case": "[EN] expected two",
			},
			fr: {
				NOTCAMELCASE: "[FR] expected one",
				"not-camel-case": "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "camel-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should report malformed key from delimited keys when namingConvention is camel-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				"NotCamelCase.NotCamelCase": "[EN] expected one",
				"not_camel.case_case.example": "[EN] expected two",
			},
			fr: {
				"NotCamelCase.NotCamelCase": "[EN] expected one",
				"not_camel.case_case.example": "[EN] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "camel-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "NotCamelCase.NotCamelCase",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "not_camel.case_case.example",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "NotCamelCase.NotCamelCase",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "not_camel.case_case.example",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should not report a malformed key problem for period-delimited camel-case keys when namingConvention is camel-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				"camelCase.camelCase": "[EN] expected one",
				"moreCamelCase.example": "[EN] expected two",
			},
			fr: {
				"camelCase.camelCase": "[FR] expected one",
				"moreCamelCase.example": "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "camel-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		expect(problemStore.report).not.toHaveBeenCalled();
	});

	it(`should report a malformed key problem for period-delimited camel-case keys when namingConvention is camel-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				"camelCase.not-camel-case": "[EN] expected one",
				"moreCamelCase.example": "[EN] expected two",
			},
			fr: {
				"camelCase.not-camel-case": "[FR] expected one",
				"moreCamelCase.example": "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "camel-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "camelCase.not-camel-case",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "camelCase.not-camel-case",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(2);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
	});

	it(`should not report camelCase key as malformed key when namingConvention is camel-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				thisIsCamelCase: "[EN] expected one",
				thisIsCamelCase2: "[EN] expected two",
			},
			fr: {
				thisIsCamelCase: "[FR] expected one",
				thisIsCamelCase2: "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "camel-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		expect(problemStore.report).not.toHaveBeenCalled();
	});

	it(`should report malformed keys with camel-case by default if no namingConvention is provided with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				NOTCAMELCASE: "[EN] expected one",
				"not-camel-case": "[EN] expected two",
			},
			fr: {
				NOTCAMELCASE: "[FR] expected one",
				"not-camel-case": "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should report malformed key when namingConvention is pascal-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				notPascalCase: "[EN] expected one",
				not_pascal_case: "[EN] expected two",
			},
			fr: {
				notPascalCase: "[FR] expected one",
				not_pascal_case: "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "pascal-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "notPascalCase",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "not_pascal_case",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "notPascalCase",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "not_pascal_case",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should not report PascalCase key as malformed key when namingConvention is pascal-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				ThisIsPascalCase: "[EN] expected one",
				ThisIsPascalCase2: "[EN] expected two",
			},
			fr: {},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "pascal-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		expect(problemStore.report).not.toHaveBeenCalled();
	});

	it(`should report malformed key when namingConvention is snake-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				notSnakeCase: "[EN] expected one",
				"not-snake-case": "[EN] expected two",
			},
			fr: {
				notSnakeCase: "[FR] expected one",
				"not-snake-case": "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "snake-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "notSnakeCase",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "not-snake-case",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "notSnakeCase",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "not-snake-case",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should not report snake_case key as malformed key when namingConvention is pascal-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				this_is_snake_case: "[EN] expected one",
				this_is_snake_case_2: "[EN] expected two",
			},
			fr: {
				this_is_snake_case: "[FR] expected one",
				this_is_snake_case_2: "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "snake-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		expect(problemStore.report).not.toHaveBeenCalled();
	});

	it(`should report malformed key as ignored with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				this_is_snake_case: "[EN] expected one",
				thisIsCamelCase: "[EN] expected two",
			},
			fr: {
				this_is_snake_case: "[FR] expected one",
				thisIsCamelCase: "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "snake-case",
					ignoreKeys: ["thisIsCamelCase"],
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "thisIsCamelCase",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: true,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "thisIsCamelCase",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: true,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(2);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
	});

	it(`should report malformed key when validationFunctionPath is provided with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				NOTCAMELCASE: "[EN] expected one",
				"not-camel-case": "[EN] expected two",
			},
			fr: {
				NOTCAMELCASE: "[FR] expected one",
				"not-camel-case": "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "camel-case",
					validationFunctionPath: "./custom-key-name-validation.js",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should ignore ignoredKeys when validationFunctionPath is provided with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				NOTCAMELCASE: "[EN] expected one",
				"not-camel-case": "[EN] expected two",
			},
			fr: {
				NOTCAMELCASE: "[FR] expected one",
				"not-camel-case": "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "camel-case",
					validationFunctionPath: "./custom-key-name-validation.js",
					ignoreKeys: ["not-camel-case", "NOTCAMELCASE"],
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: true,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: true,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "NOTCAMELCASE",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: true,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "not-camel-case",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: true,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should report malformed key when namingConvention is kebab-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				NOT_KEBAB_CASE: "[EN] expected one",
				notKebabCase: "[EN] expected two",
			},
			fr: {
				NOT_KEBAB_CASE: "[FR] expected one",
				notKebabCase: "[FR] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "kebab-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expected1 = getMalformedKeyFoundProblem({
			key: "NOT_KEBAB_CASE",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected2 = getMalformedKeyFoundProblem({
			key: "notKebabCase",
			severity,
			ruleMeta,
			locale: "en",
			isIgnored: false,
		});

		const expected3 = getMalformedKeyFoundProblem({
			key: "NOT_KEBAB_CASE",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		const expected4 = getMalformedKeyFoundProblem({
			key: "notKebabCase",
			severity,
			ruleMeta,
			locale: "fr",
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(4);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(expected3);
		expect(problemStore.report).toHaveBeenCalledWith(expected4);
	});

	it(`should not report malformed key when namingConvention is kebab-case with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				"kebab-case": "[EN] expected one",
				"more-kebab-case.delimited": "[EN] expected two",
			},
			fr: {
				"kebab-case": "[EN] expected one",
				"more-kebab-case.delimited": "[EN] expected two",
			},
		};

		const config = {
			...baseConfig,
			rules: {
				"no-malformed-keys": {
					severity,
					namingConvention: "kebab-case",
				},
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		expect(problemStore.report).not.toHaveBeenCalled();
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
			convention_1: "[EN] expected one",
			"convention-2": "[EN] expected two",
			someConvention3: "[EN] expected three",
			SomeConventionFour: "[EN] expected four",
		},
		fr: {
			convention_1: "[FR] expected one",
			"convention-2": "[FR] expected two",
			someConvention3: "[FR] expected three",
			SomeConventionFour: "[FR] expected four",
		},
	};

	const config = {
		...baseConfig,
		rules: {
			"no-malformed-keys": {
				severity: "off",
				namingConvention: "snake-case",
			},
		},
	} as Config;

	rule.run(translationFiles, config, problemStore, context);
	expect(problemStore.report).not.toHaveBeenCalled();
});
