const WORDS = {
  Food: [
    { w: "Pizza", close: "Often delivered", medium: "Shared between friends", vague: "Round" },
    { w: "Sushi", close: "Fancy and cold", medium: "Small bites", vague: "Small" },
    { w: "Burger", close: "Stacked in layers", medium: "Held with two hands", vague: "Messy" },
    { w: "Ice Cream", close: "Disappears fast", medium: "Cold and sweet", vague: "Melting" },
    { w: "Pancakes", close: "Weekend breakfast", medium: "Stacked flat", vague: "Sweet" },
    { w: "Tacos", close: "Falls apart when eaten", medium: "Folded shell", vague: "Handful" },
    { w: "Chocolate", close: "Gift shop favorite", medium: "Dark or milk", vague: "Brown" },
    { w: "Pineapple", close: "Sweet and spiky", medium: "Controversial topping", vague: "Tropical" },
    { w: "Coffee", close: "Mornings need it", medium: "People are addicted", vague: "Bitter" },
    { w: "Popcorn", close: "Noisy snack", medium: "Bucket-sized", vague: "Light" },
    { w: "Pasta", close: "Twirled on a fork", medium: "Boiled and sauced", vague: "Long" },
    { w: "Watermelon", close: "Heavy and juicy", medium: "Seeds inside", vague: "Juicy" }
  ],
  Animals: [
    { w: "Elephant", close: "Impossible to miss", medium: "Enormous", vague: "Heavy" },
    { w: "Penguin", close: "Dressed up", medium: "Waddles", vague: "Cold" },
    { w: "Dog", close: "Waits by the door", medium: "Loyal", vague: "Loud" },
    { w: "Cat", close: "Acts like royalty", medium: "Ignores you", vague: "Nap" },
    { w: "Shark", close: "Terrifying fin", medium: "Ocean danger", vague: "Teeth" },
    { w: "Kangaroo", close: "Carries its young", medium: "Bounces", vague: "Jumping" },
    { w: "Owl", close: "Wise-looking", medium: "Awake at night", vague: "Night" },
    { w: "Giraffe", close: "Tallest of all", medium: "Long neck", vague: "Tall" },
    { w: "Snake", close: "Moves without legs", medium: "Slithers", vague: "Hiss" },
    { w: "Whale", close: "Largest of all", medium: "Ocean giant", vague: "Massive" },
    { w: "Frog", close: "Pond noise", medium: "Hops", vague: "Green" },
    { w: "Monkey", close: "Climbs everything", medium: "Mischievous", vague: "Banana" }
  ],
  Places: [
    { w: "Beach", close: "Sandy and sunny", medium: "Vacation spot", vague: "Waves" },
    { w: "Airport", close: "Everyone in a hurry", medium: "Long lines", vague: "Luggage" },
    { w: "Hospital", close: "Everyone nervous", medium: "Doctors work here", vague: "Emergency" },
    { w: "School", close: "Bells and desks", medium: "Everyone went there", vague: "Homework" },
    { w: "Cinema", close: "Dark and loud", medium: "Snacks in the dark", vague: "Screen" },
    { w: "Mountain", close: "Very high up", medium: "Hard to climb", vague: "Rocky" },
    { w: "Desert", close: "Nothing for miles", medium: "Very dry", vague: "Sand" },
    { w: "Library", close: "Everyone whispers", medium: "Endless shelves", vague: "Quiet" },
    { w: "Gym", close: "Sweaty", medium: "New Year promises", vague: "Heavy" },
    { w: "Restaurant", close: "Someone serves you", medium: "Handed a menu", vague: "Waiters" },
    { w: "Moon", close: "Bright at night", medium: "Far above", vague: "Above" },
    { w: "Jungle", close: "Dense and green", medium: "Full of vines", vague: "Vines" }
  ],
  Objects: [
    { w: "Smartphone", close: "Always in your hand", medium: "It buzzes", vague: "Screen" },
    { w: "Umbrella", close: "Only needed some days", medium: "Used when it pours", vague: "Cover" },
    { w: "Guitar", close: "Campfire favorite", medium: "Made of strings", vague: "Music" },
    { w: "Mirror", close: "Always honest", medium: "Morning check", vague: "Glass" },
    { w: "Toaster", close: "Breakfast assistant", medium: "It pops", vague: "Heat" },
    { w: "Backpack", close: "Carries your day", medium: "Straps over shoulders", vague: "Heavy" },
    { w: "Pillow", close: "Soft and quiet", medium: "Sleep companion", vague: "Comfort" },
    { w: "Clock", close: "Always ticking", medium: "Never stops", vague: "Time" },
    { w: "Camera", close: "Captures moments", medium: "Memories", vague: "Click" },
    { w: "Bicycle", close: "Two wheels", medium: "No fuel needed", vague: "Balance" },
    { w: "Candle", close: "Flickers in the dark", medium: "Made of wax", vague: "Flame" },
    { w: "Headphones", close: "Private bubble", medium: "Blocks the world out", vague: "Music" }
  ],
  Sports: [
    { w: "Football", close: "Weekend obsession", medium: "Fans argue about it", vague: "Ball" },
    { w: "Basketball", close: "Tall players", medium: "Squeaky shoes", vague: "Hoop" },
    { w: "Tennis", close: "Quiet crowd, then loud", medium: "Across a net", vague: "Racket" },
    { w: "Cricket", close: "Takes forever", medium: "Long summer days", vague: "Bat" },
    { w: "Chess", close: "Completely silent", medium: "Requires thinking", vague: "Board" },
    { w: "Swimming", close: "Wet", medium: "Lanes", vague: "Water" },
    { w: "Boxing", close: "Violent", medium: "Gloves", vague: "Ring" },
    { w: "Skiing", close: "Fast downhill", medium: "Cold slopes", vague: "Snow" },
    { w: "Golf", close: "Quiet outdoors", medium: "Green grass", vague: "Holes" },
    { w: "Volleyball", close: "Beach classic", medium: "Spiking", vague: "Net" },
    { w: "Marathon", close: "Exhausting", medium: "Very long", vague: "Running" },
    { w: "Skateboarding", close: "Street tricks", medium: "Scraped knees", vague: "Wheels" }
  ]
};

if (typeof module !== "undefined") module.exports = WORDS;
