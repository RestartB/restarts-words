import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/auth';

import { db } from '$lib/server/db/index';
import { dailyWords, discordUsers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';

export const GET: RequestHandler = async ({ request }) => {
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
		const { word, wordID } = await request.json();

		if (!word || typeof word !== 'string' || !wordID || typeof wordID !== 'number') {
			return json({ error: 'Invalid input data' }, { status: 400 });
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

		if (Number(user[0].lastCompletedDaily) === wordID) {
			return json({
				complete: true
			});
		} else {
			return json({
				complete: false
			});
		}
	} catch (error) {
		console.error('API Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
