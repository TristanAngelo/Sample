import axios from 'axios';

const config = {
  name: 'cassandra',
  version: '2.5',
  author: 'JV Barcenas && LiANE For ChescaAI', // do not change
  credits: 'JV Barcenas && LiANE For ChescaAI', // do not change
  commandCategory: 'Ai - Chat',
  description: 'Baliw na babaeng ai',
  usage: '[prompt]',
};

async function onCall({ message }) {
  try {
    const prompt = message.body.trim();

    if (prompt) {
      const response = await axios.get(`https://school-project-lianefca.bene-edu-ph.repl.co/` + `ask/cassandra?query=${encodeURIComponent(prompt)}`);

      if (response.data) {
        const messageText = response.data.message;
        await message.reply(messageText)
          .then((d) => {
            d.addReplyEvent({
              callback: handleReply
            });
          });
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
}

async function handleReply({ message }) {
  try {
    const prompt = message.body.trim();

    if (prompt) {
      const response = await axios.get(`https://school-project-lianefca.bene-edu-ph.repl.co/` + `ask/cassandra?query=${encodeURIComponent(prompt)}`);

      if (response.data) {
        const messageText = response.data.message;
        await message.reply(messageText)
          .then((d) => {
            d.addReplyEvent({
              callback: handleReply
            });
          });

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
}

export default {
  config,
  onCall,
  handleReply
};
