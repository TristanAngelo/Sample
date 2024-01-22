const config = {
  name: 'rockpaperscissor',
  aliases: ["rps"],
  description: 'Play scissors with bots',
  usage: '<Use command to show the tutorial menu>',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

const choices = ['scissor', 'rock', 'paper'];
const emojis = ['✌️', '✊', '🖐'];

function determineWinner(userChoice, botChoice) {
  if (userChoice === botChoice) {
    return 'draw';
  } else if (
    (userChoice === 'rock' && botChoice === 'scissor') ||
    (userChoice === 'paper' && botChoice === 'rock') ||
    (userChoice === 'scissor' && botChoice === 'paper')
  ) {
    return 'win';
  } else {
    return 'lose';
  }
}

export async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const targetID = message.senderID;

  if (args.length < 2) {
    return message.reply('[⚜️] ➜ 𝚄𝚜𝚊𝚐𝚎: rockpaperscissor <choice> <bet>');
  }

  const userChoice = args[0].toLowerCase();
  const betAmount = parseInt(args[1], 10);

  if (isNaN(betAmount) || betAmount <= 0) {
    return message.reply('[⚜️] ➜ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚙𝚘𝚜𝚒𝚝𝚒𝚟𝚎 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝.');
  }

  const userMoney = await Users.getMoney(targetID);

  if (userMoney < betAmount) {
    return message.reply('[⚜️] ➜ 𝚈𝚘𝚞 𝚍𝚘𝚗\'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚊𝚝 𝚋𝚎𝚝.');
  }

  if (!choices.includes(userChoice)) {
    return message.reply('[⚜️] ➜ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚘𝚘𝚜𝚎 𝚎𝚒𝚝𝚑𝚎𝚛 𝚜𝚌𝚒𝚜𝚜𝚘𝚛, 𝚛𝚘𝚌𝚔, 𝚘𝚛 𝚙𝚊𝚙𝚎𝚛.');
  }

  const botChoice = choices[Math.floor(Math.random() * choices.length)];
  const result = determineWinner(userChoice, botChoice);

  let winAmount = 0;
  if (result === 'win') {
    winAmount = betAmount * 2;
    await Users.increaseMoney(targetID, winAmount);
  } else if (result === 'lose') {
    await Users.decreaseMoney(targetID, betAmount);
  }

  let resultMessage = '';
  if (result === 'win') {
    resultMessage = `[⚜️] ➜ 𝚈𝚘𝚞 𝚠𝚒𝚗! ${winAmount} coins!`;
  } else if (result === 'lose') {
    resultMessage = `[⚜️] ➜ 𝚈𝚘𝚞 𝚕𝚘𝚜𝚎! ${betAmount} coins.`;
  } else {
    resultMessage = '[⚜️] ➜ 𝙳𝚛𝚊𝚠!';
  }

  const userEmoji = emojis[choices.indexOf(userChoice)];
  const botEmoji = emojis[choices.indexOf(botChoice)];

  message.reply(
    `[⚜️] ➜ 𝚈𝚘𝚞: ${userEmoji}\n[⚜️] ➜ 𝙱𝚘𝚝: ${botEmoji}\n${resultMessage}`
  );
}

export default {
  config,
  onCall,
};