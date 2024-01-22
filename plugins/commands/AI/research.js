import google from 'googlethis';

export const config = {
  name: "research",
  version: "1.0.0",
  credits: "JOHN RÉ PORAS (Converted by Grim)",//modified by NtrEms, don't change the credits!
  description: "𝗦𝗲𝗮𝗿𝗰𝗵 𝗮𝗻𝗱 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗿𝗲𝘀𝗲𝗮𝗿𝗰𝗵 𝗽𝗮𝗽𝗲𝗿𝘀 𝗳𝗿𝗼𝗺 𝗥𝗲𝘀𝗲𝗮𝗿𝗰𝗵𝗚𝗮𝘁𝗲",
  usage: "[𝗧𝗶𝘁𝗹𝗲]",
  cooldown: 5
};

export async function onCall({ message, args }) {
  let query = args.join(" ");
  const options = {
    page: 0,
    safe: false,
    additional_params: {
      hl: "en",
    },
  };

  if (!query) {
    return message.reply("Search query cannot be left blank!");
  }

  const wait = await message.reply(`🔎Searching for "${query}"...`);

  const response = await google.search(`site:researchgate.net ${query}`, options);

  let results = "";
  for (let i = 0; i < 5; i++) {
    let title = response.results[i].title;
    let author = response.results[i].description;
    let link = response.results[i].url + ".pdf";
    results += `\n📄 RESEARCH PAPER ${i + 1}:\n\TITLE: ${title}\n\nDESCRIPTION: ${author}\n\nLINK: [DOWNLOAD ∇ PDF!] (${link})\n\n`;
  }

  await global.api.unsendMessage(wait.messageID);
  message.reply(results);
};
