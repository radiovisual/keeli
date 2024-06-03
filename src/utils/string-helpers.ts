/**
 * Check if a string is empty.
 * @param value
 * @returns boolean
 */
export function isEmptyString(value: string): boolean {
	return typeof value === "string" && value.trim() === "";
}
