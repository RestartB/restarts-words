import { db } from '$lib/server/db/index';
import { discordUsers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { auth } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Get session from server-side auth
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	console.log('Session:', session);
	console.log('User ID:', session?.user?.id);

	if (!session?.user?.id) {
		return {
			userStats: null,
			authenticated: false
		};
	}

	try {
		const userStats = await db
			.select()
			.from(discordUsers)
			.where(eq(discordUsers.id, session.user.id))
			.limit(1)
			.then((rows) => rows[0]);

		console.log('User stats:', userStats);
		if (!userStats) {
			return {
				userStats: null,
				authenticated: true,
				error: 'User stats not found'
			};
		}

		return { userStats, authenticated: true };
	} catch (error) {
		console.error('Error fetching user stats:', error);
		return {
			userStats: null,
			authenticated: true,
			error: 'Failed to fetch user stats'
		};
	}
};
