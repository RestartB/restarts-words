import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';

import { db } from '$lib/server/db/index';
import { discordUsers, dailyWords } from '$lib/server/db/schema';
import { eq, lte, desc } from 'drizzle-orm/expressions';

export const load: LayoutServerLoad = async (event) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session?.user?.id) {
		// Try to get user
		const userStats = await db
			.select()
			.from(discordUsers)
			.where(eq(discordUsers.id, session.user.id))
			.limit(1)
			.then((rows) => rows[0]);

		if (!userStats) {
			// Create user in database
			await db.insert(discordUsers).values({
				id: session.user.id,
				avatar: session.user.image || '',
				creationTime: Date.now() * 1000, // Convert to milliseconds
				lastCompletedDaily: 0,
				dailyStreak: 0,
				dailyCompleted: 0,
				dailyWon: 0,
				lastAttempts: 0,
				customCompleted: 0,
				customWon: 0
			});
		}

		// Get today's word from DB
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

		// Check if user's streak is still valid
		const dailyWord = dailyWordResult[0];
		const lastCompleted = userStats.lastCompletedDaily;

		if (!(lastCompleted === dailyWord.id || lastCompleted === dailyWord.id - 1)) {
			console.warn(
				`User ${session.user.id} streak reset: last completed ${lastCompleted}, current daily word ${dailyWord.id}`
			);
			// Reset streak
			await db
				.update(discordUsers)
				.set({
					dailyStreak: 0
				})
				.where(eq(discordUsers.id, session.user.id));
		}

		return {
			session
		};
	}
};
