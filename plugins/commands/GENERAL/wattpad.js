import axios from "axios";
import cheerio from "cheerio";

export const config = {
  name: "wattpad",
  version: "1.0",
  credits: "Someone (Converted by Grim)",
  description: "Retrieve Wattpad stories.",
  usage: "[title]"
}

export async function onCall({ message, args, prefix }) {
  const searchTerm = args.join(" ");
  if (!searchTerm) {
    return message.reply(`Please provide a title. For example: ${prefix}${config.name} Possessive Series`)
  };
  
  try {
    const response = await axios.get("https://www.wattpad.com/search/" + searchTerm);
    const $ = cheerio.load(response.data);
    const stories = [];

    $(".story-card-data.hidden-xxs > div.story-info").each((index, element) => {
      const $element = $(element);

      const story = {
        title: $element.find("> div.title").text(),
        view: $element.find("> ul > li:nth-child(1) > div.icon-container > div > span.stats-value").text(),
        vote: $element.find("> ul > li:nth-child(2) > div.icon-container > div > span.stats-value").text(),
        chapter: $element.find("> ul > li:nth-child(3) > div.icon-container > div > span.stats-value").text(),
        url: "https://www.wattpad.com" + $element.find('a').attr('href'),
        thumb: $element.find("> div.cover > img").attr("src"),
        description: $element.find("> div.description").text().replace(/\n/g, ''),
      };

      stories.push(story);
    });

    message.reply("Fetching Wattpad stories... 📝");

    const topStories = stories.slice(0, 2);

    let messages = "";
    topStories.forEach((story, index) => {
      messages += `[${index + 1}] Title: ${story.title}\nAuthor: ${story.author}\nViews: ${story.view}\nVotes: ${story.vote}\nChapters: ${story.chapter}\nDescription: ${story.description}\nURL: ${story.url}\n\n`;
    });

    message.reply(messages);
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while fetching Wattpad stories.");
  }
};
