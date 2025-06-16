import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/auth';

import { db } from '$lib/server/db/index';
import {
	fourLetters,
	fiveLetters,
	sixLetters,
	sevenLetters,
	eightLetters,
	nineLetters,
	discordUsers
} from '$lib/server/db/schema';
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
		const { word, wordID, length, won } = await request.json();

		if (
			!word ||
			typeof word !== 'string' ||
			!wordID ||
			typeof wordID !== 'number' ||
			!length ||
			typeof length !== 'number'
		) {
			return json({ error: 'Invalid input data' }, { status: 400 });
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

		// Pick correct table to use based on word length
		let wordTable;
		switch (length) {
			case 4:
				wordTable = fourLetters;
				break;
			case 5:
				wordTable = fiveLetters;
				break;
			case 6:
				wordTable = sixLetters;
				break;
			case 7:
				wordTable = sevenLetters;
				break;
			case 8:
				wordTable = eightLetters;
				break;
			case 9:
				wordTable = nineLetters;
				break;
			default:
				return json({ error: 'Invalid word length' }, { status: 400 });
		}

		// Get completed word from database
		const completedWord = await db
			.select()
			.from(wordTable)
			.where(eq(wordTable.id, wordID))
			.limit(1);

		if (completedWord.length === 0) {
			return json({ error: 'Word not found' }, { status: 404 });
		}

		// Validate the submitted word
		if (word.toLowerCase() !== completedWord[0].word.toLowerCase()) {
			return json({ error: 'Invalid word submission' }, { status: 400 });
		}

		// Update user stats in transaction
		await db.transaction(async (tx) => {
			await tx
				.update(discordUsers)
				.set({
					customCompleted: Number(user[0].customCompleted) + 1,
					customWon: won ? Number(user[0].customWon) + 1 : Number(user[0].customWon)
				})
				.where(eq(discordUsers.id, session.user.id));
		});

		return json({
			success: true,
			customCompleted: Number(user[0].customCompleted) + 1,
			customWon: won ? Number(user[0].customWon) + 1 : Number(user[0].customWon)
		});

		// Success response after updating user data
		return json({ success: true });
	} catch (error) {
		console.error('API Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
