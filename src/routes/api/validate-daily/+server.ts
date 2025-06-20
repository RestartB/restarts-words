import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

import { db } from '$lib/server/db/index';
import { dailyWords, discordUsers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Get the session from better-auth
		const session = await auth.api.getSession({
			headers: request.headers
		});

		// Check if user is authenticated
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body
		const { word, wordID, won, attempts } = await request.json();

		if (!word || typeof word !== 'string') {
			return json({ error: 'Invalid word input' }, { status: 400 });
		}

		if (!wordID || typeof wordID !== 'number') {
			return json({ error: 'Invalid word ID' }, { status: 400 });
		}

		if (!attempts || typeof wordID !== 'number') {
			return json({ error: 'Invalid attempts' }, { status: 400 });
		}

		if (typeof won !== 'boolean') {
			return json({ error: 'Invalid won status' }, { status: 400 });
		}

		// Get current user data
		const user = await db
			.select()
			.from(discordUsers)
			.where(eq(discordUsers.id, session.user.id))
			.limit(1);

		if (user.length === 0) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		if (Number(user[0].lastCompletedDaily) === wordID) {
			return json({ error: 'Daily word already completed' }, { status: 400 });
		}

		// Get completed word from database
		const completedWord = await db
			.select()
			.from(dailyWords)
			.where(eq(dailyWords.id, wordID))
			.limit(1);

		if (completedWord.length === 0) {
			return json({ error: 'Daily word not found' }, { status: 404 });
		}

		// Validate the submitted word
		if (word.toLowerCase() !== completedWord[0].word.toLowerCase()) {
			return json({ error: 'Invalid word submission' }, { status: 400 });
		}

		// Check if user's streak is still valid
		const lastCompleted = user[0].lastCompletedDaily;
		let newStreak;

		if (!(lastCompleted === completedWord[0].id || lastCompleted === completedWord[0].id - 1)) {
			newStreak = 1;
		} else {
			newStreak = Number(user[0].dailyStreak) + 1;
		}

		// Update user stats in transaction
		await db.transaction(async (tx) => {
			await tx
				.update(discordUsers)
				.set({
					lastCompletedDaily: wordID,
					dailyStreak: newStreak,
					dailyCompleted: Number(user[0].dailyCompleted) + 1,
					dailyWon: won ? Number(user[0].dailyWon) + 1 : Number(user[0].dailyWon),
					lastAttempts: attempts
				})
				.where(eq(discordUsers.id, session.user.id));
		});

		return json({
			success: true,
			newStreak,
			dailyCompleted: Number(user[0].dailyCompleted) + 1,
			dailyWon: won ? Number(user[0].dailyWon) + 1 : Number(user[0].dailyWon)
		});
	} catch (error) {
		console.error('API Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
