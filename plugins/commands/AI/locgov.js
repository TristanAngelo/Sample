import axios from 'axios';
import google from 'googlethis';

export const config = {
  name: "locgov",
  version: "1.0.0",
  credits: "August Quinn (Converted by Grim)",
  description: "Get comprehensive insights from loc.gov, Wikipedia, and Google with the loc.gov command.",
  usage: "[keywords]",
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
    return message.reply("Invalid format!\n\nPlease enter your search keywords.");
  }

  message.reply(`🔎 Searching for "${query}" on loc.gov...`);

  const response = await google.search(`site:loc.gov/ ${query}`, options);

  let results = "";
  for (let i = 0; i < Math.min(5, response.results.length); i++) {
    let title = response.results[i].title;
    let authorCite = response.results[i].description;
    let link = response.results[i].url;

    results += `\n📄 𝗥𝗘𝗦𝗘𝗔𝗥𝗖𝗛 𝗥𝗘𝗦𝗢𝗨𝗥𝗖𝗘 ${i + 1}:\n\n   ⦿ 𝗧𝗜𝗧𝗟𝗘: ${title}\n\n   ⦿ 𝗖𝗜𝗧𝗘: ${authorCite}\n\n   ⦿ 𝗟𝗜𝗡𝗞: ${link}\n\n`;

    try {
      const apiResponse = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}`);
      const pages = apiResponse.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const pageData = pages[pageId];
      const extract = pageData.extract || "";

      if (extract) {
        const paragraphs = extract.split("\n\n").filter(para => para.length > 0);
        for (const paragraph of paragraphs) {
          results += `𝗪𝗜𝗞𝗜𝗣𝗘𝗗𝗜𝗔 𝗥𝗔𝗡𝗗𝗢𝗠 𝗥𝗘𝗦𝗨𝗟𝗧: ${paragraph}\n\n`;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  message.reply(results);

  const alternativeResponse = await google.search(`${query}`, options);
  let alternativeResults = "\n\n🔎 𝗔𝗟𝗧𝗘𝗥𝗡𝗔𝗧𝗜𝗩𝗘 𝗦𝗘𝗔𝗥𝗖𝗛 𝗥𝗘𝗦𝗨𝗟𝗧𝗦 𝗙𝗥𝗢𝗠 𝗚𝗢𝗢𝗚𝗟𝗘\n";
  for (let i = 0; i < Math.min(5, alternativeResponse.results.length); i++) {
    let alternativeTitle = alternativeResponse.results[i].title;
    let alternativeDescription = alternativeResponse.results[i].description;
    let alternativeLink = alternativeResponse.results[i].url;

    alternativeResults += `\n\n𝗧𝗜𝗧𝗟𝗘: ${alternativeTitle}\n\n𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${alternativeDescription}\n\n𝗟𝗜𝗡𝗞: ${alternativeLink}`;
  }

  message.reply(alternativeResults);
};
