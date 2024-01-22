import path from 'path';

const config = {
  name: "memegenerator",
  aliases: ["memegen"],
  version: "2.0.0",
  credits: "August Quinn (Converted by Grim)",
  description: "Generate memes with various templates and custom text",
  usage: "/[type] [toptext] [bottomtext] | list",
  cooldown: 5
};

const memeTemplates = {
  "harrypotter": "Harry-Potter-Ok",
  "10guy": "10-Guy",
  "1950s": "1950s-Middle-Finger",
  "1990s": "1990s-First-World-Problems",
  "2ndtermobama": "2nd-Term-Obama",
  "afraidtoaskandy": "Afraid-To-Ask-Andy",
  "alienmeeting": "Alien-Meeting-Suggestion",
  "amitheonlyone": "Am-I-The-Only-One-Around-Here",
  "anristares": "Anri-Stares",
  "babycry": "Baby-Cry",
  "blackgirlwat": "Black-Girl-Wat",
  "bitchplease": "Bitch-Please",
  "buddychrist": "Buddy-Christ",
  "computerguy": "Computer-Guy",
  "clown": "Clown-Applying-Makeup",
  "confusedgranddad": "Confused-Granddad",
  "cutecat": "Cute-Cat",
  "dadjoke": "Dad-Joke",
  "disastergirl": "Disaster-Girl",
  "doge": "Doge-2",
  "epicuristkid": "Epicurist-Kid",
  "evilcown": "Evil-Cows",
  "expandingbrain": "Expanding-Brain",
  "woman&cat": "Woman-Yelling-At-Cat",
  "batman&robin": "Batman-Slapping-Robin",
  "changemymind": "Change-My-Mind",
  "burnkitty": "Burn-Kitty",
  "chubbybubbles": "Chubby-Bubbles-Girl",
  "distractedboyfriend": "Distracted-Boyfriend",
  "drake": "Drake-Bad-Good",
  "god": "God",
  "gollum": "Gollum",
  "goodfellas": "Good-Fellas-Hilarious",
  "otherwomen": "I-Bet-Hes-Thinking-About-Other-Women",
  "kevinhart": "Kevin-Hart",
  "leonardodicaprio": "Leonardo-Dicaprio-Cheers",
  "metaljesus": "Metal-Jesus",
  "monkeypuppet": "Monkey-Puppet",
  "omgcat": "OMG-Cat",
  "rollsafe": "Roll-Safe-Think-About-It",
  "sadpablo": "Sad-Pablo-Escobar",
  "smilingjesus": "Smiling-Jesus",
  "zuckerberg": "Zuckerberg",
  "askandy": "Afraid-To-Ask-Andy",
  // Add more templates as needed, paki-visit lang nitong website "https://apimeme.com"
};

async function onCall({ message, args, prefix }) {
  const { threadID, messageID } = message;
  const memePath = path.join(
    global.cachePath,
    `${Date.now()}_memegen_${messageID}.png`
  );
  
  try {
    if (!args[0]) {
      message.reply(`Kindly provide a meme type or use '${prefix}memegenerator list' to see available templates!`);
      return;
    }

    const memeType = args[0].toLowerCase();

    if (memeType === "list") {
      const templateList = Object.keys(memeTemplates).map((template) => `- ${template}`).join("\n");
      global.api.sendMessage(`📜 Available meme templates:\n\n${templateList}`, threadID, messageID);
      return;
    }

    if (!memeTemplates[memeType]) {
      message.reply(`Invalid meme type. Use '${prefix}memegenerator list' to see the available templates.`);
      return;
    }

    const memeContents = args.slice(1).join(" ").split("|");

    const topText = encodeURIComponent(memeContents[0] || "").trim();
    const bottomText = encodeURIComponent(memeContents[1] || "").trim();

    const memeURL = `https://apimeme.com/meme?meme=${memeTemplates[memeType]}&top=${topText}&bottom=${bottomText}`;
    await global.downloadFile(memePath, memeURL);

    await message.reply(
      {
        attachment: global.reader(memePath),
        body: `🎉 Here's your custom ${memeType} meme!`
      }
    );
  } catch (error) {
    console.error("Error generating meme:", error);
    message.reply("Error generating meme. Try again with different text or type!");
  } finally {
    if (global.isExists(memePath)) {
      global.deleteFile(memePath);
    }
  }
};

export default {
  config,
  onCall
}