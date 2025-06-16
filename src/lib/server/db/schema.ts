import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const fourLetters = sqliteTable('fourLetters', {
	id: integer().primaryKey({ autoIncrement: true }),
	word: text().notNull()
});

export const fiveLetters = sqliteTable('fiveLetters', {
	id: integer().primaryKey({ autoIncrement: true }),
	word: text().notNull()
});

export const sixLetters = sqliteTable('sixLetters', {
	id: integer().primaryKey({ autoIncrement: true }),
	word: text().notNull()
});

export const sevenLetters = sqliteTable('sevenLetters', {
	id: integer().primaryKey({ autoIncrement: true }),
	word: text().notNull()
});

export const eightLetters = sqliteTable('eightLetters', {
	id: integer().primaryKey({ autoIncrement: true }),
	word: text().notNull()
});

export const nineLetters = sqliteTable('nineLetters', {
	id: integer().primaryKey({ autoIncrement: true }),
	word: text().notNull()
});

export const dailyWords = sqliteTable('dailyWords', {
	id: integer().primaryKey({ autoIncrement: true }),
	word: text().notNull(),
	startTime: integer().notNull()
});

export const discordUsers = sqliteTable('discordUsers', {
	id: text().primaryKey().notNull(),
	avatar: text().notNull(),
	creationTime: integer().notNull(),
	lastCompletedDaily: integer().notNull(),
	dailyStreak: integer().notNull(),
	dailyCompleted: integer().notNull(),
	dailyWon: integer().notNull(),
	lastAttempts: integer().notNull(),
	customCompleted: integer().notNull(),
	customWon: integer().notNull()
});

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' })
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	)
});
