const WORDS = {
  Food: [
    { w: "Pizza", close: "The box never opens gently", medium: "A circle divided beyond reason", vague: "Corners" },
    { w: "Sushi", close: "Trust served raw", medium: "Small cold offerings", vague: "Precision" },
    { w: "Burger", close: "Engineered to collapse", medium: "Two hands, no plate", vague: "Pressure" },
    { w: "Ice Cream", close: "Happiness on a timer", medium: "It punishes slow eaters", vague: "Drip" },
    { w: "Pancakes", close: "The first one is always a rehearsal", medium: "Breakfast wearing dessert clothes", vague: "Flip" },
    { w: "Tacos", close: "Refuses to stay together", medium: "Tuesday's loudest mess", vague: "Spill" },
    { w: "Chocolate", close: "Never survives until it is given", medium: "Sweetness with a guilty aftertaste", vague: "Snap" },
    { w: "Pineapple", close: "Loved and hated for the same reason", medium: "Starts fights at dinner", vague: "Crown" },
    { w: "Coffee", close: "The reason mornings are tolerated", medium: "A bitter daily relationship", vague: "Steam" },
    { w: "Popcorn", close: "Only acceptable when it makes noise", medium: "Watched while being eaten", vague: "Burst" },
    { w: "Pasta", close: "Twisted by design", medium: "The fork's oldest enemy", vague: "Strands" },
    { w: "Watermelon", close: "Heavy with hidden ammunition", medium: "Summer's messiest centerpiece", vague: "Juice" }
  ],
  Animals: [
    { w: "Elephant", close: "Memory's favorite giant", medium: "Nothing about it is small", vague: "Weight" },
    { w: "Penguin", close: "Dressed for every occasion", medium: "Walks like it is permanently late", vague: "Formal" },
    { w: "Dog", close: "Forgiveness with a heartbeat", medium: "Always waiting at the door", vague: "Paw" },
    { w: "Cat", close: "Owns everything, obeys nothing", medium: "A soft tiny tyrant", vague: "Ignoring" },
    { w: "Shark", close: "A smile that never needs a dentist", medium: "The reason swimmers look down", vague: "Hunger" },
    { w: "Kangaroo", close: "Built with a pocket", medium: "Treats the ground like lava", vague: "Hop" },
    { w: "Owl", close: "The only one awake at the meeting", medium: "Turns without moving its body", vague: "Nightshift" },
    { w: "Giraffe", close: "Never been to a low shelf", medium: "Eats where no one else can reach", vague: "Height" },
    { w: "Snake", close: "Moves like a rumor", medium: "A hug that never ends", vague: "Ssss" },
    { w: "Whale", close: "A heartbeat heard across oceans", medium: "The ocean's oldest secret", vague: "Deep" },
    { w: "Frog", close: "Sings when the sky cries", medium: "The pond's percussion", vague: "Leap" },
    { w: "Monkey", close: "Curious hands, zero consequences", medium: "Chaos with thumbs", vague: "Mischief" }
  ],
  Places: [
    { w: "Beach", close: "Where shoes go to die", medium: "Sand's busiest meeting point", vague: "Salt" },
    { w: "Airport", close: "Where hello and goodbye share a room", medium: "A building made of delays", vague: "Gates" },
    { w: "Hospital", close: "The building everyone hopes to leave", medium: "Where the clocks feel heavier", vague: "Beeping" },
    { w: "School", close: "Where a bell rules everything", medium: "Memories written in chalk", vague: "Bells" },
    { w: "Cinema", close: "Darkness people pay for", medium: "Where snacks cost more than the show", vague: "Dim" },
    { w: "Mountain", close: "A test that ends with a view", medium: "Patience in rock form", vague: "Peak" },
    { w: "Desert", close: "An ocean that forgot water", medium: "Where emptiness is the feature", vague: "Dunes" },
    { w: "Library", close: "Silence with a hundred voices", medium: "Where everyone whispers", vague: "Sssh" },
    { w: "Gym", close: "Where January goes to die", medium: "Promises paid for monthly", vague: "Iron" },
    { w: "Restaurant", close: "Strangers decide your timing", medium: "A menu full of questions", vague: "Plates" },
    { w: "Moon", close: "The night's oldest follower", medium: "Pulls the waters from afar", vague: "Crater" },
    { w: "Jungle", close: "Green chaos with no exits", medium: "The loudest quiet place on earth", vague: "Vines" }
  ],
  Objects: [
    { w: "Smartphone", close: "A mirror you argue with", medium: "The last thing touched at night", vague: "Glow" },
    { w: "Umbrella", close: "Plan B against the sky", medium: "Used when the sky gets emotional", vague: "Cover" },
    { w: "Guitar", close: "Six strings of group therapy", medium: "The campfire's main voice", vague: "Strings" },
    { w: "Mirror", close: "The most honest thing in the house", medium: "Where you meet your double", vague: "Glass" },
    { w: "Toaster", close: "Breakfast with a spring in it", medium: "The most dramatic appliance", vague: "Pop" },
    { w: "Backpack", close: "Your whole day, carried", medium: "Shoulders know its weight", vague: "Straps" },
    { w: "Pillow", close: "Where unfinished dreams wait", medium: "A silent nightly companion", vague: "Soft" },
    { w: "Clock", close: "A circle that eats time", medium: "Speaks only in ticks", vague: "Tick" },
    { w: "Camera", close: "Steals moments, keeps them forever", medium: "The world, frozen", vague: "Flash" },
    { w: "Bicycle", close: "Balance is earned, not given", medium: "Two wheels, zero fuel", vague: "Pedal" },
    { w: "Candle", close: "Dies slowly to light your night", medium: "Wax that fights darkness", vague: "Wax" },
    { w: "Headphones", close: "A door built for ears", medium: "The reason you missed your stop", vague: "Volume" }
  ],
  Sports: [
    { w: "Football", close: "The world's biggest argument", medium: "A religion with a ball", vague: "Goals" },
    { w: "Basketball", close: "Where tall people find purpose", medium: "Squeaks and bounces", vague: "Hoops" },
    { w: "Tennis", close: "A polite argument across a net", medium: "Where love means nothing", vague: "Ace" },
    { w: "Cricket", close: "Measured in tea breaks", medium: "Five days of suspense", vague: "Wickets" },
    { w: "Chess", close: "War with no casualties", medium: "Kings who never move", vague: "Check" },
    { w: "Swimming", close: "Fighting water on purpose", medium: "Wet laps in lanes", vague: "Strokes" },
    { w: "Boxing", close: "Respect delivered with fists", medium: "Solved inside a ring", vague: "Bruise" },
    { w: "Skiing", close: "Falling with style", medium: "Going downhill is the point", vague: "Slope" },
    { w: "Golf", close: "A long walk ruined by a small ball", medium: "Silence broken by regret", vague: "Par" },
    { w: "Volleyball", close: "Never let it touch the ground", medium: "Net games at the beach", vague: "Spike" },
    { w: "Marathon", close: "A decision regretted for hours", medium: "Miles of second thoughts", vague: "Wall" },
    { w: "Skateboarding", close: "Scars collected in style", medium: "Sidewalks are the arena", vague: "Ollie" }
  ]
};

if (typeof module !== "undefined") module.exports = WORDS;
