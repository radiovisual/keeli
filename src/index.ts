#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import minimist, { type ParsedArgs } from "minimist";
import { runRules } from "./engine/rule-engine.ts";
import type { Config } from "./types.ts";
import { defaultConfig } from "./config/default-config.ts";

const argv: ParsedArgs = minimist(process.argv.slice(2));

const configPath =
	typeof argv?.config === "string"
		? path.resolve(process.cwd(), argv.config)
		: path.resolve(process.cwd(), "keeli.config.json");

// Only start keeli if the keeli configuration file is found.
if (fs.existsSync(configPath)) {
	const userConfig: Config = JSON.parse(fs.readFileSync(configPath, "utf8"));

	const config = { ...defaultConfig, ...userConfig };

	if (config?.verbose || argv?.verbose) {
		console.log(`Keeli config:`);
		console.log(config);
	}

	if (!config.enabled) {
		const message = `keeli is disabled. Exiting.`;
		console.log(chalk.yellow(message));
		process.exit(1);
	}

	runRules(config);
} else {
	const message = `keeli's config file was not found at path: ${configPath}`;
	console.log(chalk.red(message));
	process.exit(1);
}
