import { db } from '$lib/server/db/index';
import { fiveLetters, dailyWords } from '$lib/server/db/schema';
import { lte, desc } from 'drizzle-orm/expressions';

export async function load() {
	const fiveLetterWords = await db.select().from(fiveLetters);

	// Get current UNIX time
	const currentTime = Math.floor(Date.now() / 1000);

	// Get word that may match
	const dailyWord = await db
		.select()
		.from(dailyWords)
		.where(lte(dailyWords.startTime, currentTime))
		.orderBy(desc(dailyWords.startTime))
		.limit(1);

	return {
		fiveLetterWords: fiveLetterWords.map((word) => word.word),
		dailyWord: dailyWord[0]?.word || 'HELLO', // Fallback word
		day: dailyWord[0]?.id || 0, // Fallback day
	};
}
