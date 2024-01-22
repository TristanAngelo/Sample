// Import the necessary module for making HTTP requests
import axios from 'axios';
import fetch from 'node-fetch';

export const config = {
  name: "autobard",
  version: "0.0.1-xaviabot-port-refactor",
  credits: "Clarence DK (MODIFIED by Dymyrius",
  description: "auto-reply based on certain keywords"
};

let apikey;

async function fetchApiKey() {
  const response = await fetch("https://pastebin.com/raw/KYc1ZTvx");
  apikey = await response.text();
}

fetchApiKey();

export async function onCall({ message, eventData }) {
  if (message.body.length === 0) return;

  const keywordReplies = [
    { keyword: "Dymyrius", reply: "He's busy" },
    { keyword: "Creighztan", reply: "He's busy" },
    // Add more keyword-reply pairs here
  ];

  const lowercaseMessage = message.body.toLowerCase();

  for (const pair of keywordReplies) {
    if (lowercaseMessage.includes(pair.keyword.toLowerCase())) {
      return message.reply(pair.reply);
    }
  }

  if (lowercaseMessage.includes("Brav") || lowercaseMessage.includes("brav")) {
    try {
      const query = message.body;
      message.react("⏳")
      const response = await fetch(`https://api4free.kenliejugarap.com/cyrusbardapi?question=${encodeURIComponent(query)}`);
      const data = await response.json();
      const content = data.response;
      message.react("✅")
      message.reply(` ${content}\n\nNOTE: Do not spam!`);
    } catch (error) {
      message.react("❌");
      console.error("Error fetching AI response:", error);
    }
  }
}