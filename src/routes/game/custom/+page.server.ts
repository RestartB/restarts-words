import { db } from '$lib/server/db/index';
import {
	fourLetters,
	fiveLetters,
	sixLetters,
	sevenLetters,
	eightLetters,
	nineLetters
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';

export async function load({ url }) {
	// Get requested amount of letters from URL
	const letters = url.searchParams.get('letters') || '4';
	const strID = url.searchParams.get('id') || '';
	let id: number | undefined;

	if (strID !== '' && strID !== null) {
		id = parseInt(strID, 10);
	}

	if (letters === '4') {
		// If an ID is provided, check if it exists in the database
		if (id !== undefined) {
			const specificWord = await db.select().from(fourLetters).where(eq(fourLetters.id, id));
			if (specificWord.length > 0) {
				const words = await db.select().from(fourLetters);
				return {
					words: words.map((word) => word.word),
					randomWord: specificWord[0].word,
					id: specificWord[0].id,
					invalid: false
				};
			} else {
				return {
					words: [].map(() => ''),
					randomWord: '',
					id: 0,
					invalid: true,
					reason: 'Word with that ID not found.'
				};
			}
		}

		const words = await db.select().from(fourLetters);

		// Pick a random word from the list
		const randomWord = words[Math.floor(Math.random() * words.length)];
		return {
			words: words.map((word) => word.word),
			randomWord: randomWord.word,
			id: randomWord.id,
			invalid: false
		};
	} else if (letters === '5') {
		// If an ID is provided, check if it exists in the database
		if (id !== undefined) {
			const specificWord = await db.select().from(fiveLetters).where(eq(fiveLetters.id, id));
			if (specificWord.length > 0) {
				const words = await db.select().from(fiveLetters);
				return {
					words: words.map((word) => word.word),
					randomWord: specificWord[0].word,
					id: specificWord[0].id,
					invalid: false
				};
			} else {
				return {
					words: [].map(() => ''),
					randomWord: '',
					id: 0,
					invalid: true,
					reason: 'Word with that ID not found.'
				};
			}
		}

		const words = await db.select().from(fiveLetters);
		// Pick a random word from the list
		const randomWord = words[Math.floor(Math.random() * words.length)];
		return {
			words: words.map((word) => word.word),
			randomWord: randomWord.word,
			id: randomWord.id,
			invalid: false
		};
	} else if (letters === '6') {
		// If an ID is provided, check if it exists in the database
		if (id !== undefined) {
			const specificWord = await db.select().from(sixLetters).where(eq(sixLetters.id, id));
			if (specificWord.length > 0) {
				const words = await db.select().from(sixLetters);
				return {
					words: words.map((word) => word.word),
					randomWord: specificWord[0].word,
					id: specificWord[0].id,
					invalid: false
				};
			} else {
				return {
					words: [].map(() => ''),
					randomWord: '',
					id: 0,
					invalid: true,
					reason: 'Word with that ID not found.'
				};
			}
		}

		const words = await db.select().from(sixLetters);
		// Pick a random word from the list
		const randomWord = words[Math.floor(Math.random() * words.length)];
		return {
			words: words.map((word) => word.word),
			randomWord: randomWord.word,
			id: randomWord.id,
			invalid: false
		};
	} else if (letters === '7') {
		// If an ID is provided, check if it exists in the database
		if (id !== undefined) {
			const specificWord = await db.select().from(sevenLetters).where(eq(sevenLetters.id, id));
			if (specificWord.length > 0) {
				const words = await db.select().from(sevenLetters);
				return {
					words: words.map((word) => word.word),
					randomWord: specificWord[0].word,
					id: specificWord[0].id,
					invalid: false
				};
			} else {
				return {
					words: [].map(() => ''),
					randomWord: '',
					id: 0,
					invalid: true,
					reason: 'Word with that ID not found.'
				};
			}
		}

		const words = await db.select().from(sevenLetters);
		// Pick a random word from the list
		const randomWord = words[Math.floor(Math.random() * words.length)];
		return {
			words: words.map((word) => word.word),
			randomWord: randomWord.word,
			id: randomWord.id,
			invalid: false
		};
	} else if (letters === '8') {
		// If an ID is provided, check if it exists in the database
		if (id !== undefined) {
			const specificWord = await db.select().from(eightLetters).where(eq(eightLetters.id, id));
			if (specificWord.length > 0) {
				const words = await db.select().from(eightLetters);
				return {
					words: words.map((word) => word.word),
					randomWord: specificWord[0].word,
					id: specificWord[0].id,
					invalid: false
				};
			} else {
				return {
					words: [].map(() => ''),
					randomWord: '',
					id: 0,
					invalid: true,
					reason: 'Word with that ID not found.'
				};
			}
		}

		const words = await db.select().from(eightLetters);
		// Pick a random word from the list
		const randomWord = words[Math.floor(Math.random() * words.length)];
		return {
			words: words.map((word) => word.word),
			randomWord: randomWord.word,
			id: randomWord.id,
			invalid: false
		};
	} else if (letters === '9') {
		// If an ID is provided, check if it exists in the database
		if (id !== undefined) {
			const specificWord = await db.select().from(nineLetters).where(eq(nineLetters.id, id));
			if (specificWord.length > 0) {
				const words = await db.select().from(nineLetters);
				return {
					words: words.map((word) => word.word),
					randomWord: specificWord[0].word,
					id: specificWord[0].id,
					invalid: false
				};
			} else {
				return {
					words: [].map(() => ''),
					randomWord: '',
					id: 0,
					invalid: true,
					reason: 'Word with that ID not found.'
				};
			}
		}

		const words = await db.select().from(nineLetters);
		// Pick a random word from the list
		const randomWord = words[Math.floor(Math.random() * words.length)];
		return {
			words: words.map((word) => word.word),
			randomWord: randomWord.word,
			id: randomWord.id,
			invalid: false
		};
	} else {
		return {
			words: [].map(() => ''),
			randomWord: '',
			id: 0,
			invalid: true,
			reason: "We don't provide words with that many letters. Please try again with less letters."
		};
	}
}
