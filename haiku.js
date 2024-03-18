const haikuWords = ["An","soul", "pond", "A", "frog", "jumps", "into", "the", "pond—", "Splash!", "sound", "again.", "The", "light", "of", "a", "candle", "Is", "transferred", "to", "another", "candle—", "Spring", "twilight", "I", "write,", "cow,", "rewrite", "Lamb", "again,", "and", "then", "A", "poppy", "blooms.", "Over", "the", "wintry", "Forest,", "winds", "howl", "in", "emotions", "feeling", "growth", "together", "team", "one-step", "hugs", "kisses", "mouse-walk", "With", "no", "leaves", "to", "blow.", "The", "powerful", "of", "these", "faces", "in", "the", "crowd;", "Petals", "on", "a", "wet,", "black", "bough.", "The", "taste", "Of", "rain", "—Why", "kneel?", "love", "between", "us", "is", "speech", "and", "breath.", "loving", "you", "is", "a", "long", "river", "running.", "life’s", "little,", "our", "heads", "memory.", "memory-house", "Redeemed", "and", "wasting", "clay", "this", "chance.", "Be", "of", "use.", "Period", "One", "blue", "egg", "all", "summer", "long", "Now", "gone", "An", "old", "silent", "pond", "A", "frog", "jumps", "into", "the", "pond—", "Splash!", "Silence", "again.", "I", "write,", "erase,", "rewrite", "Erase", "again,", "and", "then", "A", "poppy", "blooms.", "Spring", "ocean", "Swaying", "gently", "All", "day", "long.", "The", "well-bucket", "is", "Taken", "by", "the", "morning", "glory", "Going", "to", "a", "neighbour", "for", "water.", "The", "passing", "spring", "Birds", "mourn,", "Fishes", "weep", "With", "tearful", "eyes.", "In", "pale", "moonlight~", "the", "wisteria’s", "scent", "comes", "from", "far", "away.", "After", "life","creative", "a", "spider,", "how", "lonely", "I", "feel", "in", "the", "cold", "of", "night!", "The", "west", "wind", "whispered,", "And", "touched", "sweet", "the", "eyelids", "of", "spring:", "Her", "eyes,", "Primroses.", "Plum", "flower", "temple:", "Voices", "rise", "From", "the", "foothills", "Everything", "I", "touch", "with", "tenderness,", "alas,", "pricks", "like", "a", "bramble.", "Cori", "Ren", "Olinghouse", "Kai", "Mom", "Mother", "Lover"];

function randomizeWordsAndDecorateBackground(wordsArray) {
    const bodyElement = document.body;
    
    // Function to get a random integer within a range
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Function to randomize array
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    // Shuffle the words array
    const randomizedWords = shuffleArray(wordsArray);
  
    // Function to create and style a span with a word
    function createWordSpan(word) {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.position = 'absolute';
      span.style.left = `${getRandomInt(0, window.innerWidth - 100)}px`;
      span.style.top = `${getRandomInt(0, window.innerHeight - 50)}px`;
      span.style.transform = `rotate(${getRandomInt(-20, 20)}deg)`;
      span.style.opacity = '0.7'; // Adjust opacity as needed
      span.style.fontSize = `${getRandomInt(10, 24)}px`; // Randomize font size if desired
      // Add any additional styles you want here
      return span;
    }
  
    // Clear existing background spans if needed
    bodyElement.querySelectorAll('.background-word').forEach(el => el.remove());
    
    // Add each word as a span to the background
    randomizedWords.forEach(word => {
      const wordSpan = createWordSpan(word);
      wordSpan.classList.add('background-word'); // Add class for potential styling or reference
      bodyElement.appendChild(wordSpan);
    });
  }
  
  // Example usage
  randomizeWordsAndDecorateBackground(haikuWords);