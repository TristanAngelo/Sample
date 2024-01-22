import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "pet",
  aliases: ["animal"],
  description: "Buy, feed, and sell your virtual pet",
  usage: "<buy/feed/check/sell>",
  cooldown: 6,
  credits: "Gauxy"
};

const langData = {
  "en_US": {
    "pet.buySuccess": "[🎊]: 𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜, 𝚢𝚘𝚞'𝚟𝚎 𝚊𝚍𝚘𝚙𝚝𝚎𝚍 𝚊 𝚗𝚎𝚠 𝚙𝚎𝚝 𝚗𝚊𝚖𝚎𝚍 {petName}! ",
    "pet.buyFailure": "[🤦🏻‍♂️]: 𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚑𝚊𝚟𝚎 𝚊 𝚙𝚎𝚝. 𝚃𝚊𝚔𝚎 𝚌𝚊𝚛𝚎 𝚘𝚏 𝚒𝚝!",
    "pet.feedSuccess": "[🍖]: 𝚈𝚘𝚞 𝚏𝚎𝚍 {petName}. 𝙸𝚝 𝚕𝚘𝚘𝚔𝚜 𝚑𝚊𝚙𝚙𝚒𝚎𝚛 𝚗𝚘𝚠! 💕",
    "pet.feedCost": "[💰]: 𝙵𝚎𝚎𝚍𝚒𝚗𝚐 {petName} 𝚌𝚘𝚜𝚝𝚜 ₱{feedCost}.",
    "pet.feedFailure": "[🙅🏻‍♂️]: 𝚈𝚘𝚞 𝚌𝚊𝚗'𝚝 𝚏𝚎𝚎𝚍 𝚊 𝚙𝚎𝚝 𝚢𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗.",
    "pet.noPet": "[🤷🏻‍♂️]: 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚊 𝚙𝚎𝚝. 𝚄𝚜𝚎 `𝚙𝚎𝚝 𝚋𝚞𝚢` 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎.",
    "pet.checkInfo": "[💁🏻‍♂️]: 𝚈𝚘𝚞𝚛 𝚙𝚎𝚝 {petName} 𝚑𝚊𝚜 𝚐𝚛𝚘𝚠𝚗 𝚠𝚘𝚛𝚝𝚑 ₱{petValue}💰. 𝙳𝚘𝚗'𝚝 𝚏𝚘𝚛𝚐𝚎𝚝 𝚝𝚘 𝚏𝚎𝚎𝚍 𝚒𝚝.",
    "pet.sellSuccess": "[💰]: 𝚈𝚘𝚞 𝚜𝚘𝚕𝚍 {petName} 𝚏𝚘𝚛 ₱{amount}. 𝙶𝚘𝚘𝚍𝚋𝚢𝚎, 𝚕𝚒𝚝𝚝𝚕𝚎 𝚏𝚛𝚒𝚎𝚗𝚍!",
    "pet.sellFailure": "[🙅🏻‍♂️]: 𝚈𝚘𝚞 𝚌𝚊𝚗'𝚝 𝚜𝚎𝚕𝚕 𝚊 𝚙𝚎𝚝.",
  }
};

let petOwners = new Map();
const GROWTH_INTERVAL = 120 * 60 * 1000; // Faster growth interval
const PATH = join(global.assetsPath, 'pet_owners.json');

function loadPetOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    petOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load pet owners:', err);
  }
}

function savePetOwners() {
  try {
    const data = JSON.stringify([...petOwners]);
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save pet owners:', err);
  }
}

function updatePetGrowth() {
  const currentTime = Date.now();
  petOwners.forEach((pet, ownerID) => {
    const elapsedTime = currentTime - pet.lastFed;
    const growthCycles = Math.floor(elapsedTime / (60 * 1000)); // 1 minute in milliseconds

    if (growthCycles > 0) {
      const newPetValue = pet.value + (500 * growthCycles); // Increase value by 1000 for each growth cycle
      pet.value = newPetValue;
      pet.lastFed = currentTime;
    }
  });
}


loadPetOwners();

async function onCall({ message, getLang, args }) {
  const feeding = (await axios.get("https://i.imgur.com/5hYhIV6.gif", {
    responseType: "stream"
  })).data;
  const pets = (await axios.get("https://i.imgur.com/uiq7lEw.png", {
    responseType: "stream"
  })).data;
  const { Users } = global.controllers;

  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;

  async function decreaseMoney(ownerID, amount) {
    await Users.decreaseMoney(ownerID, amount);
  }

  updatePetGrowth();

  if (args.length === 0 || args[0] === "menu") {
    return message.reply({
      body: "『 𝗣𝗘𝗧 𝗠𝗘𝗡𝗨 』\n1. `pet buy <petname> <amount>` » adopt a pet.\n2. `pet feed` » feed your pet.\n3. `pet check` » check your pet's value.\n4. `pet sell` » sell your pet and earn money.",
      attachment: pets
    });
  }

  if (args[0] === "buy") {
    if (args.length < 3) {
      return message.reply("[💁🏻‍♂️]: 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚗𝚊𝚖𝚎 𝚊𝚗𝚍 𝚊𝚖𝚘𝚞𝚗𝚝 𝚏𝚘𝚛 𝚢𝚘𝚞𝚛 𝚗𝚎𝚠 𝚙𝚎𝚝.");
    }

    if (petOwners.has(senderID)) {
      return message.reply(getLang("pet.buyFailure"));
    }

    const petName = args[1];
    const amount = parseInt(args[2]);

    if (!petName || isNaN(amount) || amount <= 0) {
      return message.reply("[💁🏻‍♂️]: 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚗𝚊𝚖𝚎 𝚊𝚗𝚍 𝚊𝚖𝚘𝚞𝚗𝚝 𝚏𝚘𝚛 𝚢𝚘𝚞𝚛 𝚗𝚎𝚠 𝚙𝚎𝚝.");
    }

    const userBalance = await Users.getMoney(senderID);

    if (userBalance < amount) {
      return message.reply("[🙅🏻‍♂]: 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚋𝚊𝚕𝚊𝚗𝚌𝚎 𝚝𝚘 𝚋𝚞𝚢 𝚊 𝚙𝚎𝚝.");
    }

    petOwners.set(senderID, {
      name: petName,
      value: amount,
      lastFed: Date.now()
    });

    await decreaseMoney(senderID, amount); // Decrease user's money
    savePetOwners();

    const buySuccessMessage = getLang("pet.buySuccess").replace("{petName}", petName);
    return message.reply(buySuccessMessage);
  }

  if (args[0] === "feed") {
    if (!petOwners.has(senderID)) {
      return message.reply(getLang("pet.noPet"));
    }

    const petData = petOwners.get(senderID);
    const userBalance = await Users.getMoney(senderID);
    const feedCost = 10000; // Replace with the actual feed cost value

    if (userBalance < feedCost) {
      return message.reply("[🤦🏻‍♂️]: 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚟𝚊𝚕𝚞𝚎 𝚝𝚘 𝚏𝚎𝚎𝚍 𝚢𝚘𝚞𝚛 𝚙𝚎𝚝.");
    }

    await Users.decreaseMoney(senderID, feedCost);
    petData.value -= feedCost;
    petData.lastFed = Date.now();

    savePetOwners();

    const feedSuccessMessage = getLang("pet.feedSuccess")
      .replace("{petName}", petData.name)
      .replace("{amount}", feedCost);
    return message.reply({
      body: feedSuccessMessage,
      attachment: feeding
    });
  }

  if (args[0] === "check") {
    if (!petOwners.has(senderID)) {
      return message.reply(getLang("pet.noPet"));
    }

    const petData = petOwners.get(senderID);
    const petValue = petData.value;

    const currentTime = Date.now();
    const elapsedTime = currentTime - petData.lastFed;
    const growthCycles = Math.floor(elapsedTime / GROWTH_INTERVAL);

    const newPetValue = petValue + (1000 * growthCycles); // Calculate the new pet value based on growth

    const ageInMinutes = Math.floor(elapsedTime / (60 * 1000));

    const checkMessage = getLang("pet.checkInfo")
      .replace("{petName}", petData.name)
      .replace("{petValue}", newPetValue) // Use the new calculated value
      .replace("{ageInMinutes}", ageInMinutes)
      .replace("{growthCycles}", growthCycles);
    return message.reply(checkMessage);
  }

  if (args[0] === "sell") {
    if (!petOwners.has(senderID)) {
      return message.reply(getLang("pet.noPet"));
    }

    const petData = petOwners.get(senderID);
    const petValue = petData.value;

    await Users.increaseMoney(senderID, petValue);
    petOwners.delete(senderID);
    savePetOwners();

    return message.reply(getLang("pet.sellSuccess").replace("{petName}", petData.name).replace("{amount}", petValue));
  }

  return message.reply({
    body: "『 𝗣𝗘𝗧 𝗠𝗘𝗡𝗨 』\n1. `pet buy <petname> <amount>` » adopt a pet.\n2. `pet feed` » feed your pet.\n3. `pet check` » check your pet's value.\n4. `pet sell` » sell your pet and earn money.",
    attachment: pets
  });
}

export default {
  config,
  langData,
  onCall
};

