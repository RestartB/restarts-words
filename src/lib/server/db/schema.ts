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
