import axios from 'axios';

export const config = {
  name: 'gpt4',
  version: '2.5',
  credits: 'JV Barcenas (Converted by Grim)',
  description: 'Asks an AI for an answer based on the user prompt.',
  cooldown: 5,
  usage: ''
};

export async function onCall({ message }) {
  try {
    const prompt = message.body.trim();

    if (prompt) {
      await message.reply("Answering your question. Please wait a moment...");

      const response = await axios.get(`https://chatgayfeyti.archashura.repl.co?gpt=${encodeURIComponent(prompt)}`);

      if (response.status === 200 && response.data && response.data.content) {
        const messageText = response.data.content.trim();
        await message.reply(messageText);
        console.log('Sent answer as a reply to the user');
      } else {
        throw new Error('Invalid or missing response from API');
      }
    }
  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    message.reply(
      `${error.message}.\n\nYou can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`
    );
  }
};
