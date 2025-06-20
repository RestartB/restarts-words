import { db } from '$lib/server/db/index';
import { fiveLetters, dailyWords, discordUsers } from '$lib/server/db/schema';
import { lte, desc } from 'drizzle-orm/expressions';

import { eq } from 'drizzle-orm/expressions';
import { auth } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Get session from server-side auth
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	const fiveLetterWords = await db.select().from(fiveLetters);

	// Get current UNIX time
	const currentTime = Math.floor(Date.now() / 1000);

	// Get word that may match
	const dailyWordResult = await db
		.select()
		.from(dailyWords)
		.where(lte(dailyWords.startTime, currentTime))
		.orderBy(desc(dailyWords.startTime))
		.limit(1);

	// Check if a daily word was found
	if (dailyWordResult.length === 0) {
		throw new Error('No daily word available');
	}

	const dailyWord = dailyWordResult[0];

	// Get user stats if authenticated
	let accComplete = false;
	let lastAttempts = 0;
	if (session?.user?.id) {
		const userStats = await db
			.select()
			.from(discordUsers)
			.where(eq(discordUsers.id, session.user.id))
			.limit(1);

		if (userStats.length > 0) {
			const user = userStats[0];
			accComplete = user.lastCompletedDaily === dailyWord.id;
			lastAttempts = user.lastAttempts;
		}
	}

	return {
		fiveLetterWords: fiveLetterWords.map((word) => word.word),
		dailyWord: dailyWord.word,
		day: dailyWord.id,
		accComplete,
		lastAttempts
	};
};
