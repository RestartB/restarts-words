import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/auth';

import { db } from '$lib/server/db/index';
import { discordUsers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';

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
				customCompleted: 0,
				customWon: 0
			});
		}

		return {
			session
		};
	}
};
