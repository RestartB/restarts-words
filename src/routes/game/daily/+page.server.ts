import { db } from '$lib/server/db/index';
import { fiveLetters, dailyWords, discordUsers } from '$lib/server/db/schema';
import { lte, desc } from 'drizzle-orm/expressions';

import { eq } from 'drizzle-orm/expressions';
import { auth } from '$lib/auth';
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
	const dailyWord = await db
		.select()
		.from(dailyWords)
		.where(lte(dailyWords.startTime, currentTime))
		.orderBy(desc(dailyWords.startTime))
		.limit(1);

	// Get user stats if authenticated
	let accComplete = false;
	if (session?.user?.id) {
		const userStats = await db
			.select()
			.from(discordUsers)
			.where(eq(discordUsers.id, session.user.id))
			.limit(1);

		if (userStats.length > 0) {
			const user = userStats[0];
			accComplete = user.lastCompletedDaily === dailyWord[0]?.id;
		}

		return {
			fiveLetterWords: fiveLetterWords.map((word) => word.word),
			dailyWord: dailyWord[0].word, // Fallback word
			day: dailyWord[0].id, // Fallback day
			accComplete
		};
	}
};
