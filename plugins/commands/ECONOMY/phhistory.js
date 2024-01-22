import fs from 'fs';
import { join } from 'path';

const config = {
  name: "phquiz",
  aliases: ["phquiz", "pq", "phhistory"],
  description: "Subukan ang iyong kaalaman sa isang pagsusulit sa kasaysayan ng Pilipinas. Maglagay ng taya para manalo o mawalan ng pera.",
  usage: "<bet amount>",
  cooldown: 10,
  credits: "Dymyrius"
};

const quizDataPath = join(global.assetsPath, 'phhistory.json');

let quizData = [];

function loadQuizData() {
  try {
    const data = fs.readFileSync(quizDataPath, 'utf8');
    quizData = JSON.parse(data);
  } catch (err) {
    console.error('Failed to load quiz data:', err);
  }
}

loadQuizData();

async function onCall({ message, args, getLang }) {
  const { Users } = global.controllers;

  const userBet = parseInt(args[0]);

  if (isNaN(userBet) || userBet <= 0) {
    return message.reply("𝙼𝚊𝚗𝚐𝚢𝚊𝚛𝚒𝚗𝚐 𝚖𝚊𝚐𝚙𝚊𝚜𝚘𝚔 𝚗𝚐 𝚠𝚊𝚜𝚝𝚘𝚗𝚐 𝚝𝚊𝚢𝚊.");
  }

  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance < userBet) {
    return message.reply("𝚆𝚊𝚕𝚊 𝚔𝚊𝚗𝚐 𝚜𝚊𝚙𝚊𝚝 𝚗𝚊 𝚙𝚎𝚛𝚊 𝚙𝚊𝚛𝚊 𝚒𝚕𝚊𝚐𝚊𝚢 𝚊𝚗𝚐 𝚝𝚊𝚢𝚊 𝚗𝚊 𝚒𝚝𝚘.");
  }

  const maxBet = 100000;

  if (maxBet < userBet) {
    return message.reply(`𝙰𝚗𝚐 𝚙𝚒𝚗𝚊𝚔𝚊𝚖𝚊𝚝𝚊𝚊𝚜 𝚗𝚊 𝚝𝚊𝚢𝚊 𝚊𝚢 ₱${maxBet.toLocaleString()}.`);
  }

  // Randomly select a quiz question
  const randomIndex = Math.floor(Math.random() * quizData.length);
  const questionData = quizData[randomIndex];
  const question = questionData.question;
  const correctAnswer = questionData.answer;

  const timeLimit = 30; // Time limit in seconds

  const questionText = `${question}\n━━━━━━━━━━━━━━━\n𝙻𝚒𝚖𝚒𝚝𝚊𝚜𝚢𝚘𝚗 𝚜𝚊 𝙾𝚛𝚊𝚜: ${timeLimit} 𝚜𝚎𝚐𝚞𝚗𝚍𝚘 ⏱`;

  message.reply(questionText)
    .then(data => {
      const messageId = data.messageID;

      // Set the timer for the time limit
      const timerId = setTimeout(() => {
        message.reply("𝚃𝚊𝚙𝚘𝚜 𝚗𝚊 𝚊𝚗𝚐 𝚘𝚛𝚊𝚜! 𝙷𝚒𝚗𝚍𝚒 𝚖𝚘 𝚗𝚊𝚜𝚊𝚐𝚘𝚝 𝚜𝚊 𝚋𝚒𝚗𝚒𝚐𝚊𝚢 𝚘𝚛𝚊𝚜.")
          .then(() => global.api.unsendMessage(messageId));
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: handleScienceQuiz, myData: { correctAnswer, messageId, timerId, userBet } });
    })
    .catch(err => console.error(err));
}

async function handleScienceQuiz({ message, eventData }) {
  // Clear the timer since the user has answered
  clearTimeout(eventData.myData.timerId);

  const userAnswer = message.body;
  const { Users } = global.controllers;

  if (userAnswer.toLowerCase() === eventData.myData.correctAnswer.toLowerCase()) {
    const winnings = eventData.myData.userBet * 1;
    await Users.increaseMoney(message.senderID, winnings);
    message.reply(`𝚃𝚊𝚖𝚊! 𝙽𝚊𝚗𝚊𝚕𝚘 𝚔𝚊 𝚗𝚐 ₱${winnings}! 🎉`);
  } else {
    await Users.decreaseMoney(message.senderID, eventData.myData.userBet);
    message.reply(`𝙼𝚊𝚕𝚒! 𝙰𝚗𝚐 𝚝𝚊𝚖𝚊𝚗𝚐 𝚜𝚊𝚐𝚘𝚝 𝚊𝚢 "${eventData.myData.correctAnswer}". 𝙽𝚊𝚝𝚊𝚕𝚘 𝚔𝚊 𝚗𝚐 ₱${eventData.myData.userBet}.`);
  }

  // Unsend the question message
  global.api.unsendMessage(eventData.myData.messageId);
}

export default {
  config,
  onCall
};
