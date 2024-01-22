import morse from 'morse';

const textToMorse = (text) => {
  const morseCodeMap = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
    "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
    " ": "/",  // Add forward slash mapping for space
  };

  return text.toUpperCase().split("").map(char => morseCodeMap[char] || char).join(" ");
};

const morseToText = (morseCode) => {
  const morseCodeMap = {
    ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F", "--.": "G", "....": "H", "..": "I", ".---": "J", "-.-": "K",
    ".-..": "L", "--": "M", "-.": "N", "---": "O", ".--.": "P", "--.-": "Q", ".-.": "R", "...": "S", "-": "T", "..-": "U", "...-": "V",
    ".--": "W", "-..-": "X", "-.--": "Y", "--..": "Z",
    ".----": "1", "..---": "2", "...--": "3", "....-": "4", ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9", "-----": "0",
    "/": " ",  // Add forward slash mapping for space
  };

  return morseCode.split(" ").map(code => morseCodeMap[code] || code).join("");
};

export default {
  config: {
    name: "morse",
    aliases: [],
    version: "1.0.0",
    author: "Lance Ajiro",
    cooldown: 5,
    description: "Convert text to Morse code and decode Morse code.",
    usage: "Guide for using the command."
  },

  onCall: async function({ message, args }) {
    try {
      const input = args.join(" ");

      if (input.startsWith("-decode")) {
        const morseCode = input.substring(8);
        const decodedText = morseToText(morseCode);

        message.reply(`${decodedText}`);
      } else {
        if (input) {
          const morseCode = textToMorse(input);
          message.reply(`${morseCode}`);
        } else {
          message.reply("Please type a text to convert to Morse code.");
        }
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the command.");
    }
  }
};