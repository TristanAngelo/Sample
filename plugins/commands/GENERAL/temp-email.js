import fetch from "node-fetch";
import fs from "fs";
import { join } from 'path';

const config = {
  name: "tempmail",
  aliases: ["tm"],
  description: "Generate a temporary email or check the last generated email",
  usage: "tempmail [gen | check]",
  permissions: [2],
  credits: "",
  extra: {},
  isHidden: false
};

const langData = {
  "en_US": {
    "error": "An error occurred while fetching the response. Please try again later.",
    "processing": "⏳ Please wait...",
  }
};

const emailDataFile = join(global.assetsPath, 'emailData.json');
const allLastEmailsFile = join(global.assetsPath, 'allLastEmails.json');

let emailData = {};
let allLastEmails = {};

if (fs.existsSync(emailDataFile)) {
  const data = fs.readFileSync(emailDataFile, "utf-8");
  emailData = JSON.parse(data);
}

if (fs.existsSync(allLastEmailsFile)) {
  const data = fs.readFileSync(allLastEmailsFile, "utf-8");
  allLastEmails = JSON.parse(data);
}

async function onCall({ message, getLang, args }) {
  try {
    if ((args[0] === "check") || (args[0] === "c")) {
      const lastEmail = emailData[message.threadID]?.lastEmail;
      if (!lastEmail) {
        message.reply("No email has been generated yet. Use `tempmail gen` to generate one.");
        return;
      }

      message.reply(getLang("processing"));
      const response = await fetch(`https://tempmail-api.codersensui.repl.co/api/getmessage/${lastEmail}`);
      const data = await response.json();
      
      if (data.error) {
        message.reply(`An error occurred: ${data.error}`);
      } else {
        const messages = data.messages;
        if (messages.length === 0) {
          message.reply("No messages found for the last email.");
        } else {
          const lastMessage = messages[0];
          message.reply(`📬 Last email message:\nSubject: ${lastMessage.subject}`);
        }
      }
    } else if ((args[0] === "gen") || (args[0] === "g")) {
      message.reply(getLang("processing"));
      const response = await fetch("https://tempmail-api.codersensui.repl.co/api/gen");
      const data = await response.json();
      
      const tempEmail = data.email;
      const messageId = data.messageId;
      
      emailData[message.threadID] = {
        lastEmail: tempEmail,
        lastMessageId: messageId
      };
      
      allLastEmails[message.threadID] = tempEmail;
      
      fs.writeFileSync(emailDataFile, JSON.stringify(emailData, null, 2), "utf-8");
      fs.writeFileSync(allLastEmailsFile, JSON.stringify(allLastEmails, null, 2), "utf-8");

      message.reply(`📧 Temporary email generated: ${tempEmail}\n\nUse \`tempmail check\` to see the last email message.`);
      
      
      // New: Start auto-checking for new emails every 7 seconds
      setInterval(async () => {
        const lastEmail = emailData[message.threadID]?.lastEmail;
        if (lastEmail) {
          const response = await fetch(`https://tempmail-api.codersensui.repl.co/api/getmessage/${lastEmail}`);
          const data = await response.json();
          if (!data.error) {
            const messages = data.messages;
            if (messages.length > 0) {
              const lastMessage = messages[0];
              // Replace sendMessageToThread with your chat platform's send message method
              message.send(`📬 New email message:\nSubject: ${lastMessage.subject}`);
              // Generate a new mail
              const response = await fetch("https://tempmail-api.codersensui.repl.co/api/gen");
      const data = await response.json();
      
      const tempEmail = data.email;
      const messageId = data.messageId;
      
      emailData[message.threadID] = {
        lastEmail: tempEmail,
        lastMessageId: messageId
      };
      
      allLastEmails[message.threadID] = tempEmail;
      
      fs.writeFileSync(emailDataFile, JSON.stringify(emailData, null, 2), "utf-8");
      fs.writeFileSync(allLastEmailsFile, JSON.stringify(allLastEmails, null, 2), "utf-8");
      
      message.send(`📧 Temporary email generated: ${tempEmail}`);
      
            }
          }
        }
      }, 10000);
    }
  } catch (err) {
    console.error(err);
    message.reply(getLang("error"));
  }
}
export default {
  config,
  langData,
  onCall
};