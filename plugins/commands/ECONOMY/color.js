import axios from 'axios';

const config = {
  name: "color-color",
  aliases: ["cc", "color"],
  description: "Play Fcolor-color game with betting.",
  usage: "[red/🔴] | [blue/🔵] | [yellow/🟡] [bet]",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Dymyrius (inspired by Sies)",
};

const { api } = global;

async function onCall({ message, args }) {
  try {
    const { senderID, threadID, body } = message;
    const { Users } = global.controllers;
    const colors = [
      { emoji: '🔴', word: 'red' },
      { emoji: '🔵', word: 'blue' },
      { emoji: '🟡', word: 'yellow' }
    ];
    const chosenColor = args[0]?.toLowerCase();
    const betAmount = parseInt(args[1]);

    if (!chosenColor || !betAmount || isNaN(betAmount)) {
      return message.reply("[DYMY-WARN ⚠] » Invalid command usage! \nPlease use it like this: !color <chosen color> <bet amount>");
    }

    const chosenColorData = colors.find(color => color.emoji === chosenColor || color.word === chosenColor);

    if (!chosenColorData) {
      return message.reply("[DYMY-WARN ⚠] » Invalid color! Please choose either 🔴 (red), 🔵 (blue), or 🟡 (yellow).");
    }

    if (betAmount < 500) {
      return message.reply("[DYMY-WARN ⚠] » Bet amount must be greater than or equal to ₱500!");
    }

    const userMoney = await Users.getMoney(senderID) || null;

    if (userMoney < betAmount) {
      return message.reply(`[DYMY-WARN ⚠] » You don't have enough money to place a bet of ₱${betAmount}!`);
    }

    // Decrease user's money by the bet amount
    await Users.increaseMoney(senderID, -betAmount);

    const name = (await global.controllers.Users.getInfo(senderID))?.name || senderID;

    message.reply(`You've placed a bet of ₱${betAmount} on ${chosenColorData.emoji} (${chosenColorData.word}). Good luck, ${name}!`);

    // Store the user's color choice and bet amount
    global.chanle || (global.chanle = new Map);
    const gameData = global.chanle.get(threadID) || {
      box: threadID,
      start: false,
      players: [],
      results: []
    };

    if (gameData.players.find(player => player.userID === senderID)) {
      return message.reply("[DYMY-WARN ⚠] » You have already placed your bet for this game!");
    }

    gameData.players.push({
      name: name,
      userID: senderID,
      color: chosenColorData,
      betAmount: betAmount
    });

    global.chanle.set(threadID, gameData);

    // Start the game if not already started
    if (!gameData.start) {
      gameData.start = true;
      global.chanle.set(threadID, gameData);

      setTimeout(async () => {
          // Generate random result
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          const roll = (await axios.get("https://i.imgur.com/cktTbbH.gif", {
            responseType: "stream"
          })).data;

          global.api.sendMessage({
            body: "Checking result...",
            attachment: roll
          }, threadID, async (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

            setTimeout(async () => {
              global.api.unsendMessage(data.messageID);

              const resultMessage = generateResultMessage(chosenColorData, randomColor, gameData.players);

              // Calculate a random result (50/50 chance)
              const randomResult = Math.random() < 0.5; // 50% chance of winning

              // Update user money based on the game outcome
              for (const player of gameData.players) {
                let moneyChange = 0;

                if (randomResult && (player.color.emoji === randomColor.emoji || player.color.word === randomColor.word)) {
                  moneyChange = player.betAmount * 2; // Player wins
                  await Users.increaseMoney(player.userID, moneyChange);
                } else {
                  moneyChange = 0; // Player loses
                }
              }
              global.chanle.delete(threadID);
              global.api.sendMessage(resultMessage, threadID);
            }, 5000); // Wait 5 seconds before sending the result message
          });
      }, 20000); // Wait 20 seconds before generating result
      
    }
  } catch (e) {
    console.error(e);
    global.api.sendMessage("An error occurred while processing the command.", threadID);
  }
}

function generateResultMessage(chosenColor, randomColor, players) {
  let resultMessage = "=== 𝐂𝐨𝐥𝐨𝐫-𝐂𝐨𝐥𝐨𝐫 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭 ===\n\n";
  resultMessage += `𝐑𝐄𝐒𝐔𝐋𝐓: ${randomColor.emoji} (${randomColor.word})\n\n`;
  resultMessage += "=== 𝐏𝐥𝐚𝐲𝐞𝐫 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 ===\n";

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const playerResult = (player.color.emoji === randomColor.emoji || player.color.word === randomColor.word) ? "𝐖𝐢𝐧" : "𝐋𝐨𝐬𝐞";
    const moneyChange = playerResult === "𝐖𝐢𝐧" ? player.betAmount : -player.betAmount;
    const moneyChangeString = moneyChange >= 0 ? `+${moneyChange}` : moneyChange.toString();
    resultMessage += `${i + 1}. ${player.name}: ${playerResult} (₱${moneyChangeString})\n`;
  }

  resultMessage += "\n━━━━━━━━━━━━━\n⌈Game created by Dymyrius!⌋";

  return resultMessage;
}

export default {
  config,
  onCall
};
