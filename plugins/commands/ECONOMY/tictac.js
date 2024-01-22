import axios from 'axios';

const config = {
  name: "tictactoe",
  aliases: ["ttt", "tic", "t"],
  description: "Play a Tic-Tac-Toe game with another player.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Gauxy (fixed by Dymyrius)",
}

const BOARD_SIZE = 3;
const EMPTY_CELL = ' ';
const PLAYER_X = '✖️';
const PLAYER_O = '⭕';

function createEmptyBoard() {
  return Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(EMPTY_CELL));
}

function printBoard(board) {
  let result = '';
  for (let i = 0; i < BOARD_SIZE; i++) {
    result += board[i].map(cell => cell === EMPTY_CELL ? '⬜' : cell).join(' | ') + '\n';
    if (i < BOARD_SIZE - 1) {
      result += '━━━━━━\n';
    }
  }
  return result;
}

function checkWin(board, player) {
  // Check rows
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
      return true;
    }
  }

  // Check diagonals
  if ((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
    (board[0][2] === player && board[1][1] === player && board[2][0] === player)) {
    return true;
  }

  return false;
}

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  global.boards || (global.boards = new Map());
  const tictac = (await axios.get("https://i.imgur.com/rcJsD9X.png", {
    responseType: "stream"
  })).data;
  const board = global.boards.get(message.threadID) || createEmptyBoard();

  if (args[0] === "create") {
    if (global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » 𝙰 𝚐𝚊𝚖𝚎 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚒𝚗 𝚙𝚛𝚘𝚐𝚛𝚎𝚜𝚜 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙.", message.threadID, message.messageID);
    }

    const betAmount = parseInt(args[1]);
    if (!betAmount || isNaN(betAmount) || betAmount < 500) {
      return global.api.sendMessage("[🎮] » 𝚈𝚘𝚞 𝚗𝚎𝚎𝚍 𝚝𝚘 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝 (𝚖𝚒𝚗𝚒𝚖𝚞𝚖 ₱𝟻𝟶𝟶).", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < betAmount) {
      return global.api.sendMessage(`[🎮] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚐𝚊𝚖𝚎 𝚠𝚒𝚝𝚑 𝚊 𝚋𝚎𝚝 𝚘𝚏 ₱${betAmount}.`, message.threadID, message.messageID);
    }

    // Deduct the bet amount from the user's money balance
    await Users.decreaseMoney(message.senderID, betAmount);

    global.boards.set(message.threadID, {
      board,
      players: [message.senderID],
      host: message.senderID,
      currentPlayer: message.senderID,
      betAmount,
      started: false,
    });

    return global.api.sendMessage(`[🎮] » 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎 𝚠𝚒𝚝𝚑 𝚊 𝚋𝚎𝚝 𝚘𝚏 ₱${betAmount} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚌𝚛𝚎𝚊𝚝𝚎𝚍. 𝚄𝚜𝚎 "join" 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.`, message.threadID);
  }

  if (args[0] === "join") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage('[🎮] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚘𝚗𝚐𝚘𝚒𝚗𝚐 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙. 𝚄𝚜𝚎 "create" 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝 𝚘𝚗𝚎.', message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (room.started) {
      return global.api.sendMessage("[🎮] » 𝚃𝚑𝚎 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚜𝚝𝚊𝚛𝚝𝚎𝚍. 𝚈𝚘𝚞 𝚌𝚊𝚗'𝚝 𝚓𝚘𝚒𝚗 𝚗𝚘𝚠.", message.threadID, message.messageID);
    }

    if (room.players.length >= 2) {
      return global.api.sendMessage("[🎮] » 𝚃𝚑𝚎 𝚐𝚊𝚖𝚎 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚏𝚞𝚕𝚕. 𝚈𝚘𝚞 𝚌𝚊𝚗'𝚝 𝚓𝚘𝚒𝚗 𝚗𝚘𝚠.", message.threadID, message.messageID);
    }

    if (room.players.includes(message.senderID)) {
      return global.api.sendMessage("[🎮] » 𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < room.betAmount) {
      return global.api.sendMessage(`[🎮] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎. 𝚈𝚘𝚞 𝚗𝚎𝚎𝚍 ₱${room.betAmount} 𝚝𝚘 𝚓𝚘𝚒𝚗.`, message.threadID, message.messageID);
    }

    // Deduct the bet amount from the user's money balance
    await Users.decreaseMoney(message.senderID, room.betAmount);

    const playerInfo = await global.controllers.Users.getInfo(message.senderID);
    const playerName = playerInfo?.name || message.senderID;
    room.players.push(message.senderID);
    global.boards.set(message.threadID, room);

    return global.api.sendMessage(`[🎮] » ${playerName} 𝚑𝚊𝚜 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚎 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎`, message.threadID);
  }

  if (args[0] === "start") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage('[🎮] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚘𝚗𝚐𝚘𝚒𝚗𝚐 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙. 𝚄𝚜𝚎 "create" 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝 𝚘𝚗𝚎.', message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (room.host !== message.senderID) {
      return global.api.sendMessage("[🎮] » 𝙾𝚗𝚕𝚢 𝚝𝚑𝚎 𝚑𝚘𝚜𝚝 𝚌𝚊𝚗 𝚜𝚝𝚊𝚛𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID);
    }

    if (room.players.length !== 2) {
      return global.api.sendMessage("[🎮] » 𝚃𝚑𝚎 𝚐𝚊𝚖𝚎 𝚛𝚎𝚚𝚞𝚒𝚛𝚎𝚜 𝚝𝚠𝚘 𝚙𝚕𝚊𝚢𝚎𝚛𝚜 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝.", message.threadID, message.messageID);
    }

    if (room.started) {
      return global.api.sendMessage("[🎮] » 𝚃𝚑𝚎 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚜𝚝𝚊𝚛𝚝𝚎𝚍.", message.threadID, message.messageID);
    }

    // Randomly choose the player who makes the first move
    const firstPlayerIndex = Math.floor(Math.random() * 2);
    room.currentPlayer = room.players[firstPlayerIndex];
    room.started = true;

    global.boards.set(message.threadID, room);
    const firstPlayerInfo = await global.controllers.Users.getInfo(room.currentPlayer);
    const firstPlayerName = firstPlayerInfo?.name || room.currentPlayer;

    return global.api.sendMessage(`[🎮] » 𝚃𝚑𝚎 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚜𝚝𝚊𝚛𝚝𝚎𝚍! ${firstPlayerName} 𝚠𝚒𝚕𝚕 𝚖𝚊𝚔𝚎 𝚝𝚑𝚎 𝚏𝚒𝚛𝚜𝚝 𝚖𝚘𝚟𝚎.`, message.threadID);
  }

  if (args[0] === "play") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage('[🎮] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚘𝚗𝚐𝚘𝚒𝚗𝚐 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙. 𝚄𝚜𝚎 "create" 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝 𝚘𝚗𝚎.', message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (!room.started) {
      return global.api.sendMessage("[🎮] » 𝚃𝚑𝚎 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚗𝚘𝚝 𝚜𝚝𝚊𝚛𝚝𝚎𝚍 𝚢𝚎𝚝.", message.threadID, message.messageID);
    }

    if (!room.players.includes(message.senderID)) {
      return global.api.sendMessage('[🎮] » 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚙𝚊𝚛𝚝 𝚘𝚏 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎. 𝚄𝚜𝚎 "join" 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.', message.threadID, message.messageID);
    }

    if (message.senderID !== room.currentPlayer) {
      return global.api.sendMessage("[🎮] » 𝙸𝚝'𝚜 𝚗𝚘𝚝 𝚢𝚘𝚞𝚛 𝚝𝚞𝚛𝚗 𝚝𝚘 𝚙𝚕𝚊𝚢.", message.threadID, message.messageID);
    }

    const currentPlayerSymbol = message.senderID === room.players[0] ? PLAYER_X : PLAYER_O;
    const cellNumber = parseInt(args[1]);

    if (isNaN(cellNumber) || cellNumber < 1 || cellNumber > BOARD_SIZE * BOARD_SIZE) {
      return global.api.sendMessage("[🎮] » 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚖𝚘𝚟𝚎. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚌𝚘𝚛𝚛𝚎𝚌𝚝 𝚗𝚞𝚖𝚋𝚎𝚛 (𝟷-𝟿). 𝙵𝚘𝚛 𝚎𝚡𝚊𝚖𝚙𝚕𝚎: !tictactoe play 5", message.threadID, message.messageID);
    }

    const row = Math.floor((cellNumber - 1) / BOARD_SIZE);
    const col = (cellNumber - 1) % BOARD_SIZE;

    if (room.board[row][col] !== EMPTY_CELL) {
      return global.api.sendMessage("[🎮] » 𝚃𝚑𝚎 𝚌𝚎𝚕𝚕 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚘𝚌𝚌𝚞𝚙𝚒𝚎𝚍. 𝙲𝚑𝚘𝚘𝚜𝚎 𝚊𝚗 𝚎𝚖𝚙𝚝𝚢 𝚌𝚎𝚕𝚕 𝚝𝚘 𝚖𝚊𝚔𝚎 𝚢𝚘𝚞𝚛 𝚖𝚘𝚟𝚎.", message.threadID, message.messageID);
    }

    room.board[row][col] = currentPlayerSymbol;
    const currentBoard = printBoard(room.board);
    global.api.sendMessage(currentBoard, message.threadID);

    if (checkWin(room.board, currentPlayerSymbol)) {
      const playerInfo = await global.controllers.Users.getInfo(message.senderID);
      const playerName = playerInfo?.name || message.senderID;

      // Calculate the amount won based on the bet amount
      const winnings = room.betAmount * 2; // You can adjust the calculation as needed

      // Inform the user about the win and the amount they received
      global.api.sendMessage(`[🎮 🏆] » ${playerName} 𝚑𝚊𝚜 𝚠𝚘𝚗 𝚝𝚑𝚎 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎 𝚊𝚗𝚍 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 ₱${winnings}! 🪙`, message.threadID);

      // Update the user's money balance
      await Users.increaseMoney(message.senderID, winnings);

      // Calculate the amount lost by the opponent
      const opponentID = room.players.find(playerID => playerID !== message.senderID);
      const lostAmount = room.betAmount;

      // Deduct the lost amount from the opponent's money
      await Users.decreaseMoney(opponentID, lostAmount);

      // Delete the game from the ongoing games list
      global.boards.delete(message.threadID);

    } else if (room.board.every(row => row.every(cell => cell !== EMPTY_CELL))) {
      global.api.sendMessage("[🎮 🤝] » 𝚃𝚑𝚎 𝚐𝚊𝚖𝚎 𝚎𝚗𝚍𝚎𝚍 𝚒𝚗 𝚊 𝚍𝚛𝚊𝚠!", message.threadID);
      global.boards.delete(message.threadID);

    } else {
      // Switch to the next player's turn
      const nextPlayerIndex = (room.players.indexOf(message.senderID) + 1) % 2;
      room.currentPlayer = room.players[nextPlayerIndex];
      global.boards.set(message.threadID, room);
    }

    return;
  }

  if (args[0] === "end") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » T𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚘𝚗𝚐𝚘𝚒𝚗𝚐 𝚃𝚒𝚌-𝚃𝚊𝚌-𝚃𝚘𝚎 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙.", message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (room.host !== message.senderID) {
      return global.api.sendMessage("[🎮] » 𝙾𝚗𝚕𝚢 𝚝𝚑𝚎 𝚑𝚘𝚜𝚝 𝚌𝚊𝚗 𝚎𝚗𝚍 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎", message.threadID, message.messageID);
    }

    global.api.sendMessage("[🎮] » 𝚃𝚑𝚎 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚎𝚗𝚍𝚎𝚍 𝚋𝚢 𝚝𝚑𝚎 𝚑𝚘𝚜𝚝.", message.threadID);
    global.boards.delete(message.threadID);
    return;
  }

  if (!args[0]) {
    return global.api.sendMessage({
      body: "»〘𝐓𝐈𝐂-𝐓𝐀𝐂-𝐓𝐎𝐄〙«\n1. create <bet amount> => Create a new Tic-Tac-Toe game with a bet.\n2. join => Join an ongoing Tic-Tac-Toe game.\n3. start => Start the game (only the host can start).\n4. play <row> <column> => Make a move in the game.\n5. end => End the game (only the host can end).\nNote: The game can only be started by the host.",
      attachment: tictac,
    }, message.threadID);
  }
}

export default {
  config,
  onCall
}
