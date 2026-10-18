const WORDS = {
  Food: [
    { w: "Pizza", close: "food, baked, round", medium: "food, baked", vague: "round" },
    { w: "Sushi", close: "food, cold, small", medium: "food, cold", vague: "cold" },
    { w: "Burger", close: "food, stacked, handheld", medium: "food, handheld", vague: "stacked" },
    { w: "Ice Cream", close: "food, cold, sweet", medium: "food, sweet", vague: "sweet" },
    { w: "Pancakes", close: "food, sweet, breakfast", medium: "food, breakfast", vague: "breakfast" },
    { w: "Tacos", close: "food, handheld, messy", medium: "food, handheld", vague: "messy" },
    { w: "Chocolate", close: "food, sweet, gift", medium: "food, sweet", vague: "gift" },
    { w: "Pineapple", close: "food, fruit, tropical", medium: "food, fruit", vague: "tropical" },
    { w: "Coffee", close: "drink, hot, morning", medium: "drink, hot", vague: "hot" },
    { w: "Popcorn", close: "food, snack, loud", medium: "food, snack", vague: "loud" },
    { w: "Pasta", close: "food, italian, long", medium: "food, italian", vague: "long" },
    { w: "Watermelon", close: "food, fruit, summer", medium: "food, fruit", vague: "summer" }
  ],
  Animals: [
    { w: "Elephant", close: "wildlife, animal, huge", medium: "animal, wild", vague: "huge" },
    { w: "Penguin", close: "wildlife, animal, cold", medium: "animal, wild", vague: "waddles" },
    { w: "Dog", close: "animal, pet, loyal", medium: "animal, pet", vague: "loyal" },
    { w: "Cat", close: "animal, pet, quiet", medium: "animal, pet", vague: "quiet" },
    { w: "Shark", close: "wildlife, animal, sea", medium: "animal, sea", vague: "teeth" },
    { w: "Kangaroo", close: "wildlife, animal, jumps", medium: "animal, wild", vague: "jumps" },
    { w: "Owl", close: "wildlife, animal, night, bird", medium: "animal, bird", vague: "night" },
    { w: "Giraffe", close: "wildlife, animal, tall, spots", medium: "animal, wildlife", vague: "tall" },
    { w: "Snake", close: "wildlife, animal, crawling", medium: "animal, wild", vague: "slithers" },
    { w: "Whale", close: "wildlife, animal, sea, huge", medium: "animal, sea", vague: "spouts" },
    { w: "Frog", close: "wildlife, animal, pond", medium: "animal, wild", vague: "croaks" },
    { w: "Monkey", close: "wildlife, animal, trees", medium: "animal, wild", vague: "climbs" }
  ],
  Places: [
    { w: "Beach", close: "place, outdoors, water", medium: "place, outdoors", vague: "sandy" },
    { w: "Airport", close: "place, travel, waiting", medium: "place, travel", vague: "waiting" },
    { w: "Hospital", close: "place, building, health", medium: "place, building", vague: "health" },
    { w: "School", close: "place, building, learning", medium: "place, building", vague: "learning" },
    { w: "Cinema", close: "place, indoors, dark", medium: "place, indoors", vague: "dark" },
    { w: "Mountain", close: "place, outdoors, tall", medium: "place, outdoors", vague: "rocky" },
    { w: "Desert", close: "place, outdoors, dry, sand", medium: "place, outdoors", vague: "dry" },
    { w: "Library", close: "place, building, quiet, books", medium: "place, building", vague: "quiet" },
    { w: "Gym", close: "place, building, fitness", medium: "place, building", vague: "sweaty" },
    { w: "Restaurant", close: "place, indoors, food", medium: "place, indoors", vague: "menus" },
    { w: "Moon", close: "place, sky, night", medium: "place, sky", vague: "glowing" },
    { w: "Jungle", close: "place, outdoors, wild, green", medium: "place, outdoors", vague: "green" }
  ],
  Objects: [
    { w: "Smartphone", close: "object, tech, everyday", medium: "object, tech", vague: "screen" },
    { w: "Umbrella", close: "object, everyday, rain", medium: "object, everyday", vague: "rain" },
    { w: "Guitar", close: "object, music, strings", medium: "object, music", vague: "strings" },
    { w: "Mirror", close: "object, glass, everyday", medium: "object, glass", vague: "glass" },
    { w: "Toaster", close: "object, kitchen, appliance", medium: "object, kitchen", vague: "toasts" },
    { w: "Backpack", close: "object, carry, everyday", medium: "object, carry", vague: "straps" },
    { w: "Pillow", close: "object, soft, sleep", medium: "object, soft", vague: "soft" },
    { w: "Clock", close: "object, time, everyday", medium: "object, time", vague: "time" },
    { w: "Camera", close: "object, tech, photos", medium: "object, tech", vague: "photos" },
    { w: "Bicycle", close: "object, wheels, outdoor", medium: "object, wheels", vague: "wheels" },
    { w: "Candle", close: "object, light, wax", medium: "object, light", vague: "wax" },
    { w: "Headphones", close: "object, tech, music, ears", medium: "object, music", vague: "ears" }
  ],
  Sports: [
    { w: "Football", close: "sport, team, ball", medium: "sport, team", vague: "ball" },
    { w: "Basketball", close: "sport, team, ball, hoop", medium: "sport, ball", vague: "hoop" },
    { w: "Tennis", close: "sport, racket, net", medium: "sport, racket", vague: "racket" },
    { w: "Cricket", close: "sport, team, bat", medium: "sport, team", vague: "bat" },
    { w: "Chess", close: "game, board, thinking", medium: "game, board", vague: "board" },
    { w: "Swimming", close: "sport, water, lanes", medium: "sport, water", vague: "lanes" },
    { w: "Boxing", close: "sport, fighting, ring", medium: "sport, fighting", vague: "ring" },
    { w: "Skiing", close: "sport, snow, winter", medium: "sport, snow", vague: "snow" },
    { w: "Golf", close: "sport, outdoors, club", medium: "sport, outdoors", vague: "club" },
    { w: "Volleyball", close: "sport, team, net", medium: "sport, net", vague: "net" },
    { w: "Marathon", close: "sport, running, long", medium: "sport, running", vague: "running" },
    { w: "Skateboarding", close: "sport, wheels, tricks", medium: "sport, wheels", vague: "tricks" }
  ]
};

if (typeof module !== "undefined") module.exports = WORDS;
