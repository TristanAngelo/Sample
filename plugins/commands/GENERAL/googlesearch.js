import axios from 'axios';

export const config = {
  name: "googlesearch",
  version: "1.0.0",
  credits: "August Quinn",
  description: "Perform a Google search and retrieve results.",
  usage: "[query]",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const query = args.join(' ');

  if (!query) {
    message.reply("Please provide a search query.");
    return;
  }

  try {
    const API_BASE_URL = 'http://google.august-api.repl.co/search';
    const response = await axios.get(`${API_BASE_URL}?q=${encodeURIComponent(query)}`);

   const { organic, knowledge, related, people_also_ask } = response.data;

    let messages = `Search Results for: ${query}\n`;

    if (organic && organic.length > 0) {
      messages += "\n𝗢𝗥𝗚𝗔𝗡𝗜𝗖 𝗥𝗘𝗦𝗨𝗟𝗧𝗦:\n";
      organic.forEach((result, index) => {
        messages += `\n${index + 1}. [${result.title}](${result.link})\n${result.description}\n`;
      });
    }

    if (knowledge) {
      messages += `\n𝗞𝗡𝗢𝗪𝗟𝗘𝗗𝗚𝗘:\n${knowledge.description}\n`;
    }

    if (related && related.length > 0) {
      messages += "\n𝗥𝗘𝗟𝗔𝗧𝗘𝗗 𝗦𝗘𝗔𝗥𝗖𝗛𝗘𝗦:\n";
      related.forEach((relatedSearch) => {
        messages += `[${relatedSearch.text}](${relatedSearch.link})\n`;
      });
    }

    message.reply(messages);
  } catch (error) {
    console.error('[ERROR]', error);
    message.reply("An error occurred while performing the Google search.");
  }
};