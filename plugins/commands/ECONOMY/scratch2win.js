import crypto from "crypto";

const config = {
  name: "scratch2win",
  aliases: ["scratcher", "scratchcard"],
  description: "Scratch the card and aim for a winning combination.",
  usage: "[positions] [bet]",
  credits: "Grim",
  cooldown: 5,
  permissions: [0],
  extra: {
    minbet: 50, // The minimum bet amount
  },
  fruits: ["🍎", "🍐", "🍊", "🍋", "🍉", "🍇", "🍓", "🍒", "🍌", "🪙"], // Added 🪙 to the fruits
  bomb: "💣", // Adding the bomb emoji
};

const langData = {
  "en_US": {
    "scratch.invalid_format": "Invalid format! Please use the format: `scratch <position1> <position2> <position3> <bet>`.",
    "scratch.not_enough_money": "You don't have enough money to place this bet.",
    "scratch.win_message": "Congratulations! You won ₱{winnings}. 🎉",
    "scratch.lose_message": "Sorry, you didn't win this time.",
    // Add more messages for different scenarios or errors
  },
  "es_ES": {
    "scratch.invalid_format": "¡Formato inválido! Por favor, utiliza el formato: `scratch <posición1> <posición2> <posición3> <apuesta>`.",
    "scratch.not_enough_money": "No tienes suficiente dinero para realizar esta apuesta.",
    "scratch.win_message": "¡Felicidades! Ganaste ₱{winnings}. 🎉",
    "scratch.lose_message": "Lo siento, no ganaste en esta ocasión.",
    // Add translations for other messages in Spanish
  },
  // Add more language translations as needed
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;
  const validPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Valid positions on the card
  const bet = BigInt(args.pop() || extra.minbet);
  const positions = args.map(pos => parseInt(pos));

  // Validate the positions provided by the user
  for (const pos of positions) {
    if (!validPositions.includes(pos)) {
      return message.reply(getLang("scratch.invalid_positions"));
    }
  }

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (BigInt(userMoney) < bet) {
      return message.reply(getLang("scratch.not_enough_money"));
    }
    if (bet < BigInt(extra.minbet)) {
      return message.reply(getLang("flipcoin.min_bet", { minBet: extra.minbet }));
    }

    // Generate a scratch card with random fruits and a bomb
    const card = generateRandomCard();

    // Scratch the positions provided by the user and reveal the fruits
    const revealedFruits = scratchCard(card, positions);

    // Display the scratch card and the revealed fruits
    const cardDisplay = generateCardDisplay(card);
    const revealedDisplay = generateCardDisplay(revealedFruits);
    const revealMessage = `Revealed fruits at positions ${positions.join(', ')}:\n${revealedDisplay}`;

    // Check for winning combinations and bomb
    const winMultiplier = checkWinningCombination(revealedFruits);

    if (winMultiplier) {
      const winnings = calculateWinnings(bet, winMultiplier);
      await Users.increaseMoney(message.senderID, winnings);

      const resultMessage = getLang("scratch.win_message", { winnings });
      const replyMessage = `Here's your scratch card:\n${cardDisplay}\n\n${revealMessage}\n\n${resultMessage}`;
      return message.reply(replyMessage);
    } else {
      await Users.decreaseMoney(message.senderID, bet);

      const resultMessage = getLang("scratch.lose_message", { bet });
      const replyMessage = `Here's your scratch card:\n${cardDisplay}\n\n${revealMessage}\n\n${resultMessage}`;
      return message.reply(replyMessage);
    }
  } catch (error) {
    console.error(error);
    return message.reply(getLang("any.error"));
  }
}

function generateRandomCard() {
  const { fruits, bomb } = config;
  const card = [];
  const totalPositions = 9;

  // Generate a scratch card with revealed fruits at specific positions
  const revealedPositions = [1, 2, 3]; // Change the revealed positions as needed

  for (let i = 0; i < totalPositions; i++) {
    if (revealedPositions.includes(i + 1)) {
      // Add revealed fruits at specified positions
      const randomIndex = Math.floor(Math.random() * fruits.length);
      card.push(fruits[randomIndex]);
    } else {
      // Add random fruits or bomb at other positions
      const randomChance = Math.random() * 100;
      if (randomChance < 50) {
        const randomIndex = Math.floor(Math.random() * fruits.length);
        card.push(fruits[randomIndex]);
      } else if (randomChance >= 50 && randomChance < 90) {
        const randomIndex = Math.floor(Math.random() * totalPositions);
        card.push(bomb);
      } else {
        const randomIndex = fruits.findIndex(fruit => fruit === '🪙');
        card.push(fruits[randomIndex]);
      }
    }
  }

  return card;
}

function scratchCard(card, positions) {
  const revealedFruits = [];
  for (const pos of positions) {
    revealedFruits.push(card[pos - 1]);
  }
  return revealedFruits;
}

function checkWinningCombination(revealedFruits) {
  const { bomb, fruits } = config;

  // Check if the revealed fruits contain the bomb
  if (revealedFruits.includes(bomb)) {
    return false; // If the bomb is revealed, the user loses
  }

  // Checking for two identical fruits or 🪙 in the scratch card
  for (let i = 0; i < revealedFruits.length - 1; i++) {
    if (
      revealedFruits[i] === revealedFruits[i + 1] &&
      revealedFruits[i] !== '🪙'
    ) {
      return true; // Return true for a winning combination
    }
  }

  return false; // No winning combination found
}

function calculateWinnings(bet, winMultiplier) {
  return bet * BigInt(winMultiplier);
}

function generateCardDisplay(card) {
  let display = "";
  for (let i = 0; i < card.length; i++) {
    display += card[i];
    if ((i + 1) % 3 === 0) {
      display += "\n";
    } else {
      display += "|";
    }
  }
  return display.trim();
}

export default {
  config,
  langData,
  onCall,
};
