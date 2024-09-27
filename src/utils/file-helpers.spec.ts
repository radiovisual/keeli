import type { TranslationFiles } from "../types.js";
import { flatten } from "./file-helpers.js";

describe("flatten", () => {
	it("should flatten nested JavaScript objects", () => {
		const nested = {
			a: "hi",
			b: {
				a: null,
				b: ["foo", "", null, "bar"],
				d: "hello",
				e: {
					a: "yo",
					b: undefined,
					c: "sup",
					d: 0,
					f: [
						{ foo: 123, bar: 123 },
						{ foo: 465, bar: 456 },
					],
				},
			},
			c: "world",
		} as unknown as TranslationFiles;

		const expected = {
			a: "hi",
			"b.b.0": "foo",
			"b.b.1": "",
			"b.b.3": "bar",
			"b.d": "hello",
			"b.e.a": "yo",
			"b.e.c": "sup",
			"b.e.d": 0,
			"b.e.f.0.foo": 123,
			"b.e.f.0.bar": 123,
			"b.e.f.1.foo": 465,
			"b.e.f.1.bar": 456,
			c: "world",
		};

		expect(flatten(nested)).toEqual(expected);
	});

	it("should flatten a parsed nested JSON object", () => {
		const nested = JSON.parse(
			JSON.stringify({
				some: {
					deeply: {
						nested: {
							message: "hello",
						},
					},
				},
				another: {
					super: {
						deeply: {
							nested: {
								message: "world",
							},
						},
					},
				},
			})
		) as TranslationFiles;

		const expected = {
			"some.deeply.nested.message": "hello",
			"another.super.deeply.nested.message": "world",
		};

		expect(flatten(nested)).toEqual(expected);
	});
});
