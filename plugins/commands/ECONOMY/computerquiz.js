import fs from 'fs';
import { join } from 'path';

const config = {
  name: "computerquiz",
  aliases: ["cquiz", "cq", "computertrivia"],
  description: "Test your knowledge with a computer quiz. Place a bet to win or lose money.",
  usage: "<bet amount>",
  cooldown: 10,
  credits: "Dymyrius"
};

const quizDataPath = join(global.assetsPath, 'computerquiz.json');

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
    return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝.");
  }

  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance < userBet) {
    return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.");
  }

  const maxBet = 100000;

  if (maxBet < userBet) {
    return message.reply(`𝚃𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚒𝚜 ₱${maxBet.toLocaleString()}.`);
  }

  // Randomly select a quiz question
  const randomIndex = Math.floor(Math.random() * quizData.length);
  const questionData = quizData[randomIndex];
  const question = questionData.question;
  const correctAnswer = questionData.answer;

  const timeLimit = 30; // Time limit in seconds

  const questionText = `${question}\n━━━━━━━━━━━━━━━\n𝚃𝚒𝚖𝚎 𝙻𝚒𝚖𝚒𝚝: ${timeLimit} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜 ⏱`;

  message.reply(questionText)
    .then(data => {
      const messageId = data.messageID;

      // Set the timer for the time limit
      const timerId = setTimeout(() => {
        message.reply("𝚃𝚒𝚖𝚎'𝚜 𝚞𝚙! 𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚒𝚗 𝚝𝚒𝚖𝚎.")
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
    message.reply(`𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚠𝚘𝚗 ₱${winnings}! 🎉`);
  } else {
    await Users.decreaseMoney(message.senderID, eventData.myData.userBet);
    message.reply(`𝚆𝚛𝚘𝚗𝚐 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚃𝚑𝚎 𝚌𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚠𝚊𝚜 "${eventData.myData.correctAnswer}". 𝚈𝚘𝚞 𝚕𝚘𝚜𝚝 ₱${eventData.myData.userBet}.`);
  }

  // Unsend the question message
  global.api.unsendMessage(eventData.myData.messageId);
}

export default {
  config,
  onCall
};
