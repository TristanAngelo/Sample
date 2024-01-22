import axios from 'axios';

let defaultCharacter = "";

export const config = {
  name: "cai",
  version: "1.0",
  author: "Samir Œ",
  aliases: ["roleplay", "pretend"],
  cooldown: 5,
  description: "Character Ai"
};

export async function onCall({ message, args }) {
  const [question, character] = args.join(' ').split('|').map(item => item.trim());
  const selectedCharacter = character || defaultCharacter;

  try {
    const response = await axios.get(`https://character.samirzyx.repl.co/cai?question=${encodeURIComponent(question)}&character=${encodeURIComponent(selectedCharacter)}`);

    if (response.data && response.data.result) {
      const answer = response.data.result;
      const character = `${answer}`;
      message.reply({ body: character })
        .then((d) => {
          d.addReplyEvent({
            callback: handleReply,
            character: selectedCharacter
          });
        });
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export async function handleReply({ message, eventData }) {
  const { author } = eventData;
  const { character } = eventData;

  if (message.senderID != author) return;
  const question = message.body.trim();

  try {
    const response = await axios.get(`https://character.samirzyx.repl.co/cai?question=${encodeURIComponent(question)}&character=${encodeURIComponent(character)}`);

    if (response.data && response.data.result) {
      const answer = response.data.result;
      const character = `${answer}`;
      message.reply({ body: character })
        .then((d) => {
          d.addReplyEvent({
            callback: handleReply,
            character: character
          });
        });
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
