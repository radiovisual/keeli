import {
	isEmptyString,
	isCamelCase,
	isSnakeCase,
	isPascalCase,
	isKebabCase,
	stringHasWhitespacePadding,
	stringHasExtraneousWhitespace,
} from "./string-helpers";

describe("isEmptyString", () => {
	it("should return true for empty strings", () => {
		expect(isEmptyString("")).toBe(true);
		expect(isEmptyString("   ")).toBe(true);
	});

	it("should return false for non-empty strings", () => {
		expect(isEmptyString("hi")).toBe(false);
		expect(isEmptyString(" hello ")).toBe(false);
	});

	it("should return false for non-string inputs", () => {
		// @ts-expect-error - disable typecheck for the test
		expect(isEmptyString()).toBe(false);
	});
});

describe("isCamelCase", () => {
	it("should return true for camel case strings", () => {
		expect(isCamelCase("camelCase")).toBe(true);
		expect(isCamelCase("thisIsALongCamelCaseString")).toBe(true);
		expect(isCamelCase("hi")).toBe(true);
	});

	it("should return false for non-camel case strings", () => {
		expect(isCamelCase("")).toBe(false);
		expect(isCamelCase("HI")).toBe(false);
		expect(isCamelCase("THIS IS NOT CAMEL CASE")).toBe(false);
		expect(isCamelCase("tHIS_iS_nOT-CAMEL-cASE")).toBe(false);
	});
});

describe("isSnakeCase", () => {
	it("should return true for snake case strings", () => {
		expect(isSnakeCase("snake")).toBe(true);
		expect(isSnakeCase("this_is_snake_case")).toBe(true);
	});

	it("should return false for non-snake case strings", () => {
		expect(isSnakeCase("")).toBe(false);
		expect(isSnakeCase("yo_")).toBe(false);
		expect(isSnakeCase("THIS_IS_NOT_SNAKE_CASE")).toBe(false);
		expect(isSnakeCase("THIS IS NOT SNAKE CASE")).toBe(false);
		expect(isSnakeCase("tHIS_iS_nOT-SNAKE-cASE")).toBe(false);
	});
});

describe("isPascalCase", () => {
	it("should return true for pascal case strings", () => {
		expect(isPascalCase("ThisIsPascalCase")).toBe(true);
		expect(isPascalCase("Hello")).toBe(true);
	});

	it("should return false for non-pascal case strings", () => {
		expect(isPascalCase("")).toBe(false);
		expect(isPascalCase("thisIsNotPascalCase")).toBe(false);
		expect(isPascalCase("THIS IS NOT PASCAL CASE")).toBe(false);
		expect(isPascalCase("tHIS_iS_nOT-PASCAL-cASE")).toBe(false);
		expect(isPascalCase("_tHIS_iS_nOT-PASCAL-cASE")).toBe(false);
		expect(isPascalCase("_tHIS_iS_nOT-PASCAL-cASE_")).toBe(false);
	});
});

describe("isKebabCase", () => {
	it("should return true for kebab case strings", () => {
		expect(isKebabCase("this-is-kebab-case")).toBe(true);
		expect(isKebabCase("hello")).toBe(true);
	});

	it("should return false for non-kebab case strings", () => {
		expect(isKebabCase("")).toBe(false);
		expect(isKebabCase("thisIsNotKebabCase")).toBe(false);
		expect(isKebabCase("THIS IS NOT KEBAB CASE")).toBe(false);
		expect(isKebabCase("tHIS_iS_nOT-KEBAB-cASE")).toBe(false);
		expect(isKebabCase("this-is-not-kebab-case-")).toBe(false);
		expect(isKebabCase("-this-is-not-kebab-case-")).toBe(false);
	});
});
describe("stringHasWhitespacePadding", () => {
	it("should return true for whitespace-padded strings", () => {
		expect(stringHasWhitespacePadding(" with whitespace padding before")).toBe(
			true
		);
		expect(stringHasWhitespacePadding("with whitespace padding after ")).toBe(
			true
		);
		expect(
			stringHasWhitespacePadding("  with whitespace padding before and after  ")
		).toBe(true);
	});

	it("should return false for strings without whitespace padding strings", () => {
		expect(stringHasWhitespacePadding("no whitespace padding")).toBe(false);
	});
});

describe("stringHasExtraneousWhitespace", () => {
	it("should return true for strings with more than 1 internal contiguous whitespace character", () => {
		expect(
			stringHasExtraneousWhitespace("with    contiguous    whitespace padding")
		).toBe(true);
		expect(stringHasExtraneousWhitespace("with newlines \n\tpadding")).toBe(
			true
		);
		expect(stringHasExtraneousWhitespace("with tabs\t\t\tpadding")).toBe(true);
		expect(
			stringHasExtraneousWhitespace("with carriage returns\t\t\tpadding")
		).toBe(true);
	});

	it("should return false for strings without internal contiguous whitespace", () => {
		expect(stringHasExtraneousWhitespace("no whitespace padding")).toBe(false);
	});
});
