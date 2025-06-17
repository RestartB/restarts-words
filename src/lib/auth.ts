import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db/index';
import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	BETTER_AUTH_SECRET,
	BETTER_AUTH_URL
} from '$env/static/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
	secret: BETTER_AUTH_SECRET,
	baseURL: BETTER_AUTH_URL,
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET
		}
	}
});
