/**
 * Check if a message string contains HTML syntax.
 * @param message
 * @returns boolean
 */
export function getMessageHasHtml(message: string): boolean {
	const htmlTagRegex = /<!--[\s\S]*?-->|<\/?[\w\s="/.':;#-\/\?]+>/gi;
	return htmlTagRegex.test(message);
}
