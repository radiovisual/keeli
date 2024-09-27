import { RuleMeta, RuleSeverity } from "../types.js";

class Problem {
	ruleMeta: RuleMeta;
	severity: RuleSeverity;
	locale: string;
	message: string;
	isIgnored: boolean;
	expected?: string | object | number;
	received?: string | object | number;

	public constructor(builder: ProblemBuilder) {
		this.ruleMeta = builder.ruleMeta;
		this.severity = builder.severity;
		this.locale = builder.locale;
		this.message = builder.message;
		this.expected = builder.expected;
		this.received = builder.received;
		this.isIgnored = Boolean(builder.isIgnored);
	}

	static get Builder() {
		return new ProblemBuilder();
	}
}

class ProblemBuilder {
	ruleMeta!: RuleMeta;
	severity!: RuleSeverity;
	name!: string;
	locale!: string;
	url!: string;
	message!: string;
	expected?: string | object | number;
	received?: string | object | number;
	isIgnored?: boolean;

	withSeverity(severity: RuleSeverity): this {
		this.severity = severity;
		return this;
	}

	withIsIgnored(isIgnored?: boolean): this {
		this.isIgnored = Boolean(isIgnored);
		return this;
	}

	withRuleMeta(ruleMeta: RuleMeta): this {
		this.ruleMeta = ruleMeta;
		return this;
	}

	withLocale(locale: string): this {
		this.locale = locale;
		return this;
	}

	withMessage(message: string): this {
		this.message = message;
		return this;
	}

	withExpected(expected?: string | object | number): this {
		this.expected = expected;
		return this;
	}

	withReceived(received?: string | object | number): this {
		this.received = received;
		return this;
	}

	build(): Problem {
		return new Problem(this);
	}
}

export { Problem, ProblemBuilder };
