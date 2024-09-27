import { getMessageHasHtml } from "./message-helpers.ts";

describe("getMessageHasHtml", () => {
	it("should return true for simple HTML tags", () => {
		expect(getMessageHasHtml("<div>Hello</div>")).toBe(true);
		expect(getMessageHasHtml("<span>World</span>")).toBe(true);
	});

	it("should return true for nested HTML tags", () => {
		expect(getMessageHasHtml("<div><p>Nested</p></div>")).toBe(true);
		expect(getMessageHasHtml("<ul><li>Item</li></ul>")).toBe(true);
	});

	it("should return true for self-closing HTML tags", () => {
		expect(getMessageHasHtml('<img src="image.jpg" />')).toBe(true);
		expect(getMessageHasHtml("<br />")).toBe(true);
	});

	it("should return true for HTML tags with attributes", () => {
		expect(getMessageHasHtml('<a href="https://example.com">Link</a>')).toBe(
			true
		);
		expect(getMessageHasHtml('<input type="text" name="name" />')).toBe(true);
	});

	it("should return true for comments in HTML", () => {
		expect(getMessageHasHtml("<!-- This is a comment -->")).toBe(true);
	});

	it("should return true for complex HTML structures", () => {
		expect(
			getMessageHasHtml(
				"<div><header><h1>Title</h1></header><footer><p>Footer</p></footer></div>"
			)
		).toBe(true);
	});

	it("should return true for script and style tags", () => {
		expect(getMessageHasHtml('<script>alert("Hello")</script>')).toBe(true);
		expect(getMessageHasHtml("<style>body { color: red; }</style>")).toBe(true);
	});

	it("should return false for plain text", () => {
		expect(getMessageHasHtml("This is a plain text message.")).toBe(false);
		expect(getMessageHasHtml("Another plain message without HTML.")).toBe(
			false
		);
	});

	it("should return false for formatjs variable syntax", () => {
		expect(getMessageHasHtml("Hi, {firstName}")).toBe(false);
		expect(getMessageHasHtml("Your total is {totalAmount, number, USD}")).toBe(
			false
		);
	});

	it("should return false for ICU message format", () => {
		expect(
			getMessageHasHtml(
				"{gender, select, male {He} female {She} other {They}} will respond shortly."
			)
		).toBe(false);
		expect(
			getMessageHasHtml("{count, plural, one {1 item} other {# items}}")
		).toBe(false);
	});

	it("should handle mixed content correctly", () => {
		expect(
			getMessageHasHtml(
				"Hello <b>{name}</b>, your balance is {balance, number, USD}"
			)
		).toBe(true);
		expect(getMessageHasHtml("<div>Hi, {firstName}!</div>")).toBe(true);
	});

	it("should return true for malformed HTML tags", () => {
		expect(getMessageHasHtml("<div><span>Missing end tag")).toBe(true);
		expect(getMessageHasHtml("<div>Unclosed div")).toBe(true);
	});

	it("should return false for escaped HTML characters", () => {
		expect(getMessageHasHtml("This is an escaped &lt;div&gt; tag.")).toBe(
			false
		);
		expect(getMessageHasHtml("Another example with &lt;span&gt; tag.")).toBe(
			false
		);
	});
});
