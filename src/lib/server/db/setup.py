import sqlite3
import requests
from tqdm import tqdm

words = {
    "cigar",
    "rebut",
    "sissy",
    "humph",
    "awake",
    "blush",
    "focal",
    "evade",
    "naval",
    "serve",
    "heath",
    "dwarf",
    "model",
    "karma",
    "stink",
    "grade",
    "quiet",
    "bench",
    "abate",
    "feign",
    "major",
    "death",
    "fresh",
    "crust",
    "stool",
    "colon",
    "abase",
    "marry",
    "react",
    "batty",
    "pride",
    "floss",
    "helix",
    "croak",
    "staff",
    "paper",
    "unfed",
    "whelp",
    "trawl",
    "outdo",
    "adobe",
    "crazy",
    "sower",
    "repay",
    "digit",
    "crate",
    "cluck",
    "spike",
    "mimic",
    "pound",
    "maxim",
    "linen",
    "unmet",
    "flesh",
    "booby",
    "forth",
    "first",
    "stand",
    "belly",
    "ivory",
    "seedy",
    "print",
    "yearn",
    "drain",
    "bribe",
    "stout",
    "panel",
    "crass",
    "flume",
    "offal",
    "agree",
    "error",
    "swirl",
    "argue",
    "bleed",
    "delta",
    "flick",
    "totem",
    "wooer",
    "front",
    "shrub",
    "parry",
    "biome",
    "lapel",
    "start",
    "greet",
    "goner",
    "golem",
    "lusty",
    "loopy",
    "round",
    "audit",
    "lying",
    "gamma",
    "labor",
    "islet",
    "civic",
    "forge",
    "corny",
    "moult",
    "basic",
    "salad",
    "agate",
    "spicy",
    "spray",
    "essay",
    "fjord",
    "spend",
    "kebab",
    "guild",
    "aback",
    "motor",
    "alone",
    "hatch",
    "hyper",
    "thumb",
    "dowry",
    "ought",
    "belch",
    "dutch",
    "pilot",
    "tweed",
    "comet",
    "jaunt",
    "enema",
    "steed",
    "abyss",
    "growl",
    "fling",
    "dozen",
    "boozy",
    "erode",
    "world",
    "gouge",
    "click",
    "briar",
    "great",
    "altar",
    "pulpy",
    "blurt",
    "coast",
    "duchy",
    "groin",
    "fixer",
    "group",
    "rogue",
    "badly",
    "smart",
    "pithy",
    "gaudy",
    "chill",
    "heron",
    "vodka",
    "finer",
    "surer",
    "radio",
    "rouge",
    "perch",
    "retch",
    "wrote",
    "clock",
    "tilde",
    "store",
    "prove",
    "bring",
    "solve",
    "cheat",
    "grime",
    "exult",
    "usher",
    "epoch",
    "triad",
    "break",
    "rhino",
    "viral",
    "conic",
    "masse",
    "sonic",
    "vital",
    "trace",
    "using",
    "peach",
    "champ",
    "baton",
    "brake",
    "pluck",
    "craze",
    "gripe",
    "weary",
    "picky",
    "acute",
    "ferry",
    "aside",
    "tapir",
    "troll",
    "unify",
    "rebus",
    "boost",
    "truss",
    "siege",
    "tiger",
    "banal",
    "slump",
    "crank",
    "gorge",
    "query",
    "drink",
    "favor",
    "abbey",
    "tangy",
    "panic",
    "solar",
    "shire",
    "proxy",
    "point",
    "robot",
    "prick",
    "wince",
    "crimp",
    "knoll",
    "sugar",
    "whack",
    "mount",
    "perky",
    "could",
    "wrung",
    "light",
    "those",
    "moist",
    "shard",
    "pleat",
    "aloft",
    "skill",
    "elder",
    "frame",
    "humor",
    "pause",
    "ulcer",
    "ultra",
    "robin",
    "cynic",
    "agora",
    "aroma",
    "caulk",
    "shake",
    "pupal",
    "dodge",
    "swill",
    "tacit",
    "other",
    "thorn",
    "trove",
    "bloke",
    "vivid",
    "spill",
    "chant",
    "choke",
    "rupee",
    "nasty",
    "mourn",
    "ahead",
    "brine",
    "cloth",
    "hoard",
    "sweet",
    "month",
    "lapse",
    "watch",
    "today",
    "focus",
    "smelt",
    "tease",
    "cater",
    "movie",
    "lynch",
    "saute",
    "allow",
    "renew",
    "their",
    "slosh",
    "purge",
    "chest",
    "depot",
    "epoxy",
    "nymph",
    "found",
    "shall",
    "harry",
    "stove",
    "lowly",
    "snout",
    "trope",
    "fewer",
    "shawl",
    "natal",
    "fibre",
    "comma",
    "foray",
}


def download(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to download from {url}")
        exit(1)


with sqlite3.connect("words.db") as conn:
    cursor = conn.cursor()

    print("Clearing existing tables...")
    cursor.execute("DELETE FROM fourLetters")
    cursor.execute("DELETE FROM fiveLetters")
    cursor.execute("DELETE FROM sixLetters")
    cursor.execute("DELETE FROM sevenLetters")
    cursor.execute("DELETE FROM eightLetters")
    cursor.execute("DELETE FROM nineLetters")
    cursor.execute("DELETE FROM dailyWords")

    print("Processing 4 letter words...")

    response = download(
        "https://raw.githubusercontent.com/jonathanwelton/word-lists/refs/heads/main/4-letter-words.json"
    )
    for word in tqdm(response):
        cursor.execute("INSERT OR IGNORE INTO fourLetters (word) VALUES (?)", (word,))

    print("Processing 5 letter words...")

    response = download(
        "https://raw.githubusercontent.com/jonathanwelton/word-lists/refs/heads/main/5-letter-words.json"
    )
    for word in tqdm(response):
        cursor.execute("INSERT OR IGNORE INTO fiveLetters (word) VALUES (?)", (word,))

    print("Processing 6 letter words...")

    response = download(
        "https://raw.githubusercontent.com/jonathanwelton/word-lists/refs/heads/main/6-letter-words.json"
    )
    for word in tqdm(response):
        cursor.execute("INSERT OR IGNORE INTO sixLetters (word) VALUES (?)", (word,))

    print("Processing 7 letter words...")

    response = download(
        "https://raw.githubusercontent.com/jonathanwelton/word-lists/refs/heads/main/7-letter-words.json"
    )
    for word in tqdm(response):
        cursor.execute("INSERT OR IGNORE INTO sevenLetters (word) VALUES (?)", (word,))

    print("Processing 8 letter words...")

    response = download(
        "https://raw.githubusercontent.com/jonathanwelton/word-lists/refs/heads/main/8-letter-words.json"
    )
    for word in tqdm(response):
        cursor.execute("INSERT OR IGNORE INTO eightLetters (word) VALUES (?)", (word,))

    print("Processing 9 letter words...")

    response = download(
        "https://raw.githubusercontent.com/jonathanwelton/word-lists/refs/heads/main/9-letter-words.json"
    )
    for word in tqdm(response):
        cursor.execute("INSERT OR IGNORE INTO nineLetters (word) VALUES (?)", (word,))

    print("Entering daily words...")
    time = 1749859200
    for word in tqdm(words):
        cursor.execute(
            "INSERT OR IGNORE INTO dailyWords (word, startTime) VALUES (?, ?)",
            (
                word,
                time,
            ),
        )
        time += 86400

    print("Committing changes to the database...")
    conn.commit()

print("Database setup complete.")
