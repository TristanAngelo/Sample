import axios from 'axios';

const config = {
  name: "brainly",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Grey",
  description: "Searches for Brainly answers",
  usePrefix: true,
  commandCategory: "other",
  cooldowns: 5,
  usage: "[query]",
};

async function onCall({ args, message }) {
  const query = args.join(" ").replace(/<br\s*\/?>/g, "");

  if (!query) {
    return message.reply("Please provide a query to search.");
  }

  try {
    const response = await axios.get(
      `https://forgivegod.lazygreyzz.repl.co/api/other/search1?query=${encodeURIComponent(
        query
      )}&language=ph`
    );

    const results = response.data;

    if (results.length === 0) {
      message.reply("No results found for the query.");
      return;
    }

    let messages = "Here are the search results:\n\n";
    results.forEach((result, index) => {
      const cleanQuestion = result.question.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags from question
      messages += `${index + 1}. ${cleanQuestion}\n`;
    });

    messages += "\nPlease reply with the number of the question you want to view the answer to.";

    message.reply(messages)
      .then((info) => {
        info.addReplyEvent({
          callback: handleReply,
          results: results,
        });
      });
  } catch (error) {
    console.error("An error occurred:", error);
    message.reply("An error occurred while fetching the search results.");
  }
}

async function handleReply({ api, message, eventData }) {
  const { body, senderID } = message;
  const { author } = eventData;
  const { results } = eventData;

  if (!eventData || senderID !== author || !results || results.length === 0) {
    message.reply("There was an issue handling the reply.");
    return;
  }

  const selectedQuestionIndex = parseInt(body);
  if (isNaN(selectedQuestionIndex) || selectedQuestionIndex < 1 || selectedQuestionIndex > results.length) {
    message.reply("Please reply with a valid number corresponding to the question.");
    return;
  }

  const selectedQuestion = results[selectedQuestionIndex - 1];
  const cleanAnswer = selectedQuestion.answer
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\\[tex\\]/g, "")
    .replace(/\\[\/tex\\]/g, "")
    .replace(/\\[^\s]+/g, "");

  const response = `Question: ${selectedQuestion.question}\n\nAnswer: ${cleanAnswer}`;
  message.reply(response);
}

export default {
  config,
  onCall,
  handleReply
};
