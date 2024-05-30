import { runRules } from "./engine/rule-engine";
import * as fs from "node:fs";
import * as path from "node:path";
import { Config } from "./types";

const configPath = path.join(__dirname, "../i18n-validator.config.json");
const config: Config = JSON.parse(fs.readFileSync(configPath, "utf8"));

runRules(config);
