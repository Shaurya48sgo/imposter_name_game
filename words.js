const WORDS = {
  Food: [
    { w: "Pizza", close: "food, baked, round", medium: "food, baked", vague: "food" },
    { w: "Sushi", close: "food, cold, small", medium: "food, cold", vague: "food" },
    { w: "Burger", close: "food, stacked, handheld", medium: "food, handheld", vague: "food" },
    { w: "Ice Cream", close: "food, cold, sweet", medium: "food, sweet", vague: "food" },
    { w: "Pancakes", close: "food, sweet, breakfast", medium: "food, breakfast", vague: "food" },
    { w: "Tacos", close: "food, handheld, messy", medium: "food, handheld", vague: "food" },
    { w: "Chocolate", close: "food, sweet, gift", medium: "food, sweet", vague: "food" },
    { w: "Pineapple", close: "food, fruit, tropical", medium: "food, fruit", vague: "food" },
    { w: "Coffee", close: "drink, hot, morning", medium: "drink, hot", vague: "drink" },
    { w: "Popcorn", close: "food, snack, loud", medium: "food, snack", vague: "food" },
    { w: "Pasta", close: "food, italian, long", medium: "food, italian", vague: "food" },
    { w: "Watermelon", close: "food, fruit, summer", medium: "food, fruit", vague: "food" }
  ],
  Animals: [
    { w: "Elephant", close: "wildlife, animal, huge", medium: "animal, wild", vague: "animal" },
    { w: "Penguin", close: "wildlife, animal, cold", medium: "animal, wild", vague: "animal" },
    { w: "Dog", close: "animal, pet, loyal", medium: "animal, pet", vague: "animal" },
    { w: "Cat", close: "animal, pet, quiet", medium: "animal, pet", vague: "animal" },
    { w: "Shark", close: "wildlife, animal, sea", medium: "animal, sea", vague: "animal" },
    { w: "Kangaroo", close: "wildlife, animal, jumps", medium: "animal, wild", vague: "animal" },
    { w: "Owl", close: "wildlife, animal, night, bird", medium: "animal, bird", vague: "animal" },
    { w: "Giraffe", close: "wildlife, animal, tall, spots", medium: "animal, wildlife", vague: "animal" },
    { w: "Snake", close: "wildlife, animal, crawling", medium: "animal, wild", vague: "animal" },
    { w: "Whale", close: "wildlife, animal, sea, huge", medium: "animal, sea", vague: "animal" },
    { w: "Frog", close: "wildlife, animal, pond", medium: "animal, wild", vague: "animal" },
    { w: "Monkey", close: "wildlife, animal, trees", medium: "animal, wild", vague: "animal" }
  ],
  Places: [
    { w: "Beach", close: "place, outdoors, water", medium: "place, outdoors", vague: "place" },
    { w: "Airport", close: "place, travel, waiting", medium: "place, travel", vague: "place" },
    { w: "Hospital", close: "place, building, health", medium: "place, building", vague: "place" },
    { w: "School", close: "place, building, learning", medium: "place, building", vague: "place" },
    { w: "Cinema", close: "place, indoors, dark", medium: "place, indoors", vague: "place" },
    { w: "Mountain", close: "place, outdoors, tall", medium: "place, outdoors", vague: "place" },
    { w: "Desert", close: "place, outdoors, dry, sand", medium: "place, outdoors", vague: "place" },
    { w: "Library", close: "place, building, quiet, books", medium: "place, building", vague: "place" },
    { w: "Gym", close: "place, building, fitness", medium: "place, building", vague: "place" },
    { w: "Restaurant", close: "place, indoors, food", medium: "place, indoors", vague: "place" },
    { w: "Moon", close: "place, sky, night", medium: "place, sky", vague: "place" },
    { w: "Jungle", close: "place, outdoors, wild, green", medium: "place, outdoors", vague: "place" }
  ],
  Objects: [
    { w: "Smartphone", close: "object, tech, everyday", medium: "object, tech", vague: "object" },
    { w: "Umbrella", close: "object, everyday, rain", medium: "object, everyday", vague: "object" },
    { w: "Guitar", close: "object, music, strings", medium: "object, music", vague: "object" },
    { w: "Mirror", close: "object, glass, everyday", medium: "object, glass", vague: "object" },
    { w: "Toaster", close: "object, kitchen, appliance", medium: "object, kitchen", vague: "object" },
    { w: "Backpack", close: "object, carry, everyday", medium: "object, carry", vague: "object" },
    { w: "Pillow", close: "object, soft, sleep", medium: "object, soft", vague: "object" },
    { w: "Clock", close: "object, time, everyday", medium: "object, time", vague: "object" },
    { w: "Camera", close: "object, tech, photos", medium: "object, tech", vague: "object" },
    { w: "Bicycle", close: "object, wheels, outdoor", medium: "object, wheels", vague: "object" },
    { w: "Candle", close: "object, light, wax", medium: "object, light", vague: "object" },
    { w: "Headphones", close: "object, tech, music, ears", medium: "object, music", vague: "object" }
  ],
  Sports: [
    { w: "Football", close: "sport, team, ball", medium: "sport, team", vague: "sport" },
    { w: "Basketball", close: "sport, team, ball, hoop", medium: "sport, ball", vague: "sport" },
    { w: "Tennis", close: "sport, racket, net", medium: "sport, racket", vague: "sport" },
    { w: "Cricket", close: "sport, team, bat", medium: "sport, team", vague: "sport" },
    { w: "Chess", close: "game, board, thinking", medium: "game, board", vague: "game" },
    { w: "Swimming", close: "sport, water, lanes", medium: "sport, water", vague: "sport" },
    { w: "Boxing", close: "sport, fighting, ring", medium: "sport, fighting", vague: "sport" },
    { w: "Skiing", close: "sport, snow, winter", medium: "sport, snow", vague: "sport" },
    { w: "Golf", close: "sport, outdoors, club", medium: "sport, outdoors", vague: "sport" },
    { w: "Volleyball", close: "sport, team, net", medium: "sport, net", vague: "sport" },
    { w: "Marathon", close: "sport, running, long", medium: "sport, running", vague: "sport" },
    { w: "Skateboarding", close: "sport, wheels, tricks", medium: "sport, wheels", vague: "sport" }
  ]
};

if (typeof module !== "undefined") module.exports = WORDS;
