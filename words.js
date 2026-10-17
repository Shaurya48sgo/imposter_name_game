const WORDS = {
  Food: [
    { w: "Pizza", close: "Comes in a box", medium: "Friday night order", vague: "Slices" },
    { w: "Sushi", close: "Eaten with sticks", medium: "Chef behind the counter", vague: "Rolls" },
    { w: "Burger", close: "Fast food classic", medium: "Stacked high", vague: "Layers" },
    { w: "Ice Cream", close: "Melts fast", medium: "Brain freeze", vague: "Cold and sweet" },
    { w: "Pancakes", close: "Breakfast stack", medium: "Sunday syrup", vague: "Round and flat" },
    { w: "Tacos", close: "Folded and filled", medium: "Street food", vague: "Crunchy shell" },
    { w: "Chocolate", close: "Gift wrapper favorite", medium: "Melts in your hand", vague: "Brown and sweet" },
    { w: "Pineapple", close: "Tropical and spiky", medium: "On pizza, apparently", vague: "Prickly outside" },
    { w: "Coffee", close: "Morning ritual", medium: "Steam and beans", vague: "Bitter" },
    { w: "Popcorn", close: "Pops when heated", medium: "Movie companion", vague: "Buttery crunch" },
    { w: "Pasta", close: "Italian dinner", medium: "Boiled and sauced", vague: "Stringy" },
    { w: "Watermelon", close: "Summer picnic", medium: "Seeds to spit", vague: "Green outside, red inside" }
  ],
  Animals: [
    { w: "Elephant", close: "Never forgets", medium: "Zoo's biggest star", vague: "Trunk" },
    { w: "Penguin", close: "Formal dress code", medium: "Waddles on ice", vague: "Tuxedo bird" },
    { w: "Dog", close: "Named by the family", medium: "Learns tricks", vague: "Best friend" },
    { w: "Cat", close: "Nine lives", medium: "Ruler of the internet", vague: "Purrs" },
    { w: "Shark", close: "Fin above the water", medium: "Beach scare", vague: "Teeth" },
    { w: "Kangaroo", close: "Carries its baby", medium: "Aussie icon", vague: "Jumps" },
    { w: "Owl", close: "Symbol of wisdom", medium: "Awake all night", vague: "Hoots" },
    { w: "Giraffe", close: "Long neck", medium: "Safari photo favorite", vague: "Tallest" },
    { w: "Snake", close: "No legs", medium: "Garden surprise", vague: "Slithers" },
    { w: "Whale", close: "Ocean giant", medium: "Ships fear it", vague: "Enormous" },
    { w: "Frog", close: "Pond resident", medium: "Rainy night noise", vague: "Hops" },
    { w: "Monkey", close: "Zoo troublemaker", medium: "Banana lover", vague: "Swings" }
  ],
  Places: [
    { w: "Beach", close: "Sandy vacation", medium: "Sunburn spot", vague: "Waves" },
    { w: "Airport", close: "Where goodbyes happen", medium: "Long security lines", vague: "Luggage" },
    { w: "Hospital", close: "Where nobody wants to go", medium: "Sirens stop here", vague: "White and clean" },
    { w: "School", close: "Where friendships start", medium: "Bells ring", vague: "Homework" },
    { w: "Cinema", close: "Popcorn included", medium: "Dark room, big screen", vague: "Rows of seats" },
    { w: "Mountain", close: "Climbers' challenge", medium: "Thin air up there", vague: "Very high" },
    { w: "Desert", close: "No water for miles", medium: "Hot days, cold nights", vague: "Sand everywhere" },
    { w: "Library", close: "Everyone stays quiet", medium: "Borrow and return", vague: "Shelves" },
    { w: "Gym", close: "New Year's resolution", medium: "Sweat and mirrors", vague: "Heavy things" },
    { w: "Restaurant", close: "Someone serves you", medium: "Menu and candles", vague: "Waiters" },
    { w: "Moon", close: "Bright at night", medium: "Astronauts visited", vague: "Far above" },
    { w: "Jungle", close: "Wet and wild", medium: "Vines everywhere", vague: "Green and dense" }
  ],
  Objects: [
    { w: "Smartphone", close: "Always in your hand", medium: "Buzz in your pocket", vague: "Screen" },
    { w: "Umbrella", close: "Only needed some days", medium: "Rain companion", vague: "Opens up" },
    { w: "Guitar", close: "Campfire favorite", medium: "Strings and strums", vague: "Six strings" },
    { w: "Mirror", close: "Never lies", medium: "Morning routine", vague: "Reflection" },
    { w: "Toaster", close: "Breakfast assistant", medium: "Pops when finished", vague: "Golden and crispy" },
    { w: "Backpack", close: "Goes everywhere with you", medium: "School carry", vague: "Straps" },
    { w: "Pillow", close: "Sleepover weapon", medium: "Head rest", vague: "Soft" },
    { w: "Clock", close: "Never late with it", medium: "Ticking companion", vague: "Hands" },
    { w: "Camera", close: "Captures moments", medium: "Say cheese", vague: "Click and flash" },
    { w: "Bicycle", close: "Two wheels, no fuel", medium: "Ring the bell", vague: "Pedals" },
    { w: "Candle", close: "Flickers in the dark", medium: "Birthday wish", vague: "Wax and flame" },
    { w: "Headphones", close: "Private concert", medium: "Drowns the world out", vague: "Wear them" }
  ],
  Sports: [
    { w: "Football", close: "Played on weekends", medium: "Everyone has an opinion", vague: "Two goals" },
    { w: "Basketball", close: "Orange ball, tall players", medium: "Squeaky shoes", vague: "Hoop" },
    { w: "Tennis", close: "You say love", medium: "Wimbledon", vague: "Net and racket" },
    { w: "Cricket", close: "Can last for days", medium: "Wickets and overs", vague: "Bat and ball" },
    { w: "Chess", close: "Silent war", medium: "Checkmate", vague: "Board game" },
    { w: "Swimming", close: "Lanes and goggles", medium: "Summer pool", vague: "Wet" },
    { w: "Boxing", close: "Ropes and gloves", medium: "Ring the bell", vague: "Punch" },
    { w: "Skiing", close: "Down the slope", medium: "Lift takes you up", vague: "Snow" },
    { w: "Golf", close: "Quiet and green", medium: "Holes in the grass", vague: "Clubs" },
    { w: "Volleyball", close: "Beach or court", medium: "Spike it over", vague: "Net" },
    { w: "Marathon", close: "Very long", medium: "Mile markers", vague: "Running" },
    { w: "Skateboarding", close: "Street tricks", medium: "Scraped knees", vague: "Board with wheels" }
  ]
};

if (typeof module !== "undefined") module.exports = WORDS;
