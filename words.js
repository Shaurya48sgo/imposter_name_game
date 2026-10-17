const WORDS = {
  Food: [
    { w: "Pizza", close: "Lasagna", medium: "Cheesy Italian flatbread", vague: "Something you eat" },
    { w: "Sushi", close: "Ramen", medium: "Japanese dish with rice rolls", vague: "Something you eat" },
    { w: "Burger", close: "Hot Dog", medium: "Stacked sandwich with a patty", vague: "Something you eat" },
    { w: "Ice Cream", close: "Milkshake", medium: "Frozen sweet dessert", vague: "Something cold and sweet" },
    { w: "Pancakes", close: "Waffles", medium: "Breakfast stack with syrup", vague: "Something you eat for breakfast" },
    { w: "Tacos", close: "Burritos", medium: "Folded Mexican tortilla", vague: "Something you eat with your hands" },
    { w: "Chocolate", close: "Caramel", medium: "Sweet cocoa treat", vague: "Something sweet" },
    { w: "Pineapple", close: "Mango", medium: "Spiky tropical fruit", vague: "A fruit" },
    { w: "Coffee", close: "Tea", medium: "Hot caffeinated drink", vague: "Something you drink" },
    { w: "Popcorn", close: "Potato Chips", medium: "Snack you grab at the movies", vague: "Something crunchy" },
    { w: "Pasta", close: "Noodles", medium: "Boiled wheat dish with sauce", vague: "Something you eat for dinner" },
    { w: "Watermelon", close: "Melon", medium: "Big summer fruit, red inside", vague: "A fruit" }
  ],
  Animals: [
    { w: "Elephant", close: "Rhinoceros", medium: "Huge grey animal with a trunk", vague: "An animal" },
    { w: "Penguin", close: "Puffin", medium: "Bird dressed like a tuxedo", vague: "An animal" },
    { w: "Dog", close: "Wolf", medium: "Loyal barking pet", vague: "A pet" },
    { w: "Cat", close: "Tiger", medium: "Purring animal that naps all day", vague: "A pet" },
    { w: "Shark", close: "Dolphin", medium: "Ocean predator with sharp fins", vague: "An animal in the sea" },
    { w: "Kangaroo", close: "Wallaby", medium: "Hopping animal with a pouch", vague: "An animal" },
    { w: "Owl", close: "Eagle", medium: "Night bird that hoots", vague: "A bird" },
    { w: "Giraffe", close: "Ostrich", medium: "Tallest animal with a long neck", vague: "An animal in the wild" },
    { w: "Snake", close: "Lizard", medium: "Legless reptile that slithers", vague: "An animal" },
    { w: "Whale", close: "Shark", medium: "Giant mammal of the ocean", vague: "An animal in the sea" },
    { w: "Frog", close: "Toad", medium: "Green animal that hops near water", vague: "A small animal" },
    { w: "Monkey", close: "Ape", medium: "Primate that swings in trees", vague: "A wild animal" }
  ],
  Places: [
    { w: "Beach", close: "Swimming Pool", medium: "Sandy shore next to the sea", vague: "A place to visit" },
    { w: "Airport", close: "Train Station", medium: "Where planes land and take off", vague: "A busy place" },
    { w: "Hospital", close: "Clinic", medium: "Where doctors and nurses work", vague: "A building in town" },
    { w: "School", close: "University", medium: "Where kids go to learn", vague: "A building in town" },
    { w: "Cinema", close: "Theatre", medium: "Dark room with movies on a big screen", vague: "A place for fun" },
    { w: "Mountain", close: "Volcano", medium: "Giant rocky peak to climb", vague: "Out in nature" },
    { w: "Desert", close: "Canyon", medium: "Endless sand and scorching heat", vague: "Out in nature" },
    { w: "Library", close: "Bookstore", medium: "Quiet place full of books", vague: "A building in town" },
    { w: "Gym", close: "Stadium", medium: "Where people lift heavy weights", vague: "A building in town" },
    { w: "Restaurant", close: "Cafe", medium: "Where you sit and order a meal", vague: "A place to visit" },
    { w: "Moon", close: "Mars", medium: "Earth's companion in the night sky", vague: "Something far away" },
    { w: "Jungle", close: "Forest", medium: "Dense wild place full of trees", vague: "Out in nature" }
  ],
  Objects: [
    { w: "Smartphone", close: "Tablet", medium: "Glass rectangle you tap all day", vague: "A gadget" },
    { w: "Umbrella", close: "Raincoat", medium: "You open it when it rains", vague: "An everyday item" },
    { w: "Guitar", close: "Violin", medium: "Six strings, strummed to make music", vague: "Something people use" },
    { w: "Mirror", close: "Window", medium: "Shows your own reflection", vague: "An everyday item" },
    { w: "Toaster", close: "Microwave", medium: "Makes bread golden and crispy", vague: "A kitchen item" },
    { w: "Backpack", close: "Suitcase", medium: "Carries your stuff on your back", vague: "Something people carry" },
    { w: "Pillow", close: "Blanket", medium: "Soft thing you rest your head on", vague: "An everyday item" },
    { w: "Clock", close: "Watch", medium: "Tells you what time it is", vague: "An everyday item" },
    { w: "Camera", close: "Telescope", medium: "Captures moments as photos", vague: "A gadget" },
    { w: "Bicycle", close: "Motorcycle", medium: "Two wheels and pedals, no engine", vague: "Something people ride" },
    { w: "Candle", close: "Lamp", medium: "Wax that melts with a flame", vague: "An everyday item" },
    { w: "Headphones", close: "Speaker", medium: "Wear them to hear music privately", vague: "A gadget" }
  ],
  Sports: [
    { w: "Football", close: "Handball", medium: "Team game with a ball and two goals", vague: "A sport" },
    { w: "Basketball", close: "Volleyball", medium: "Tall hoop and an orange ball", vague: "A sport" },
    { w: "Tennis", close: "Badminton", medium: "Racket, net and a yellow ball", vague: "A sport" },
    { w: "Cricket", close: "Baseball", medium: "Bat, wickets and very long games", vague: "A sport" },
    { w: "Chess", close: "Checkers", medium: "Classic board of 64 squares", vague: "A game people play" },
    { w: "Swimming", close: "Diving", medium: "Racing through water", vague: "A sport" },
    { w: "Boxing", close: "Wrestling", medium: "Gloves and a ring", vague: "A sport" },
    { w: "Skiing", close: "Snowboarding", medium: "Racing down snowy slopes", vague: "A winter sport" },
    { w: "Golf", close: "Mini Golf", medium: "Clubs and tiny distant holes", vague: "A sport" },
    { w: "Volleyball", close: "Badminton", medium: "Net, ball and a sandy court", vague: "A sport" },
    { w: "Marathon", close: "Sprint", medium: "A very long running race", vague: "A sport" },
    { w: "Skateboarding", close: "Rollerblading", medium: "Tricks on a board with wheels", vague: "A sport" }
  ]
};

if (typeof module !== "undefined") module.exports = WORDS;
