import axios from 'axios';

const apiUrl = 'https://info.apibasic2023.repl.co';

const config = {
  name: 'profile',
  aliases: ["fl", "info", "i"],
  description: 'Check Info',
  usage: '<Use the command to display the menu>',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

export async function onCall({ message, args }) {
  const { mentions, senderID } = message;
  const mentionID = Object.keys(mentions)[0];
  const targetID = mentionID || senderID;
  const command = args[0]?.toLowerCase();
  
  switch (command) {
    case 'clear':
      if (args.length === 2) {
        const key = args[1].toLowerCase();
         if (['name', 'nickname', 'gender', 'birth', 'hometown', 'relationship', 'hobby', 'note'].includes(key)) {
          try {
            await axios.get(`${apiUrl}/clear?id=${targetID}&${key}`);
            message.send('✔️ Information cleared successfully.');
          } catch (error) {
            message.send('❌ An error occurred while clearing information.');
          }
        } else {
          message.send('❌ Invalid command.');
        }
      } else {
        message.send('❌ Incorrect syntax. Usage: `clear <case>`');
      }
      break;

    case 'add':
      if (args.length >= 3) {
        const key = args[1].toLowerCase();
        const content = args.slice(2).join(" ");
        
        if (['name', 'nickname', 'gender', 'birth', 'hometown', 'relationship', 'hobby', 'note'].includes(key)) {
          try {
            await axios.get(`${apiUrl}/add?id=${targetID}&${key}=${content}`);
            message.send('✔️ Information updated successfully.');
          } catch (error) {
            message.send('❌ An error occurred while updating information.');
          }
        } else {
          message.send('❌ Invalid command.');
        }
      } else {
        message.send('❌ Incorrect syntax. Usage: `add <case> <content>`');
      }
      break;

    case 'check':
      try {
        const response = await axios.get(`${apiUrl}/info?id=${targetID}`);
        const info = response.data;

        const { name = 'no information', nickname = 'no information', gender = 'no information', birthdate = 'no information', hometown = 'no information', relationship = 'no information', hobby = 'no information', note = 'no information' } = info;

        const infoText =
          `👤 Name: ${name}\n` +
          `🏷️ Nickname: ${nickname}\n` +
          `⚤ Gender: ${gender}\n` +
          `📅 Birthdate: ${birthdate}\n` +
          `🏠 Hometown: ${hometown}\n` +
          `💑 Relationship: ${relationship}\n` +
          `🎯 Hobby: ${hobby}\n` +
          `📝 Note: ${note}`;

        message.send(infoText);
      } catch (error) {
        message.send('❌ An error occurred while loading information.');
      }
      break;

    case 'info':
        try {
          const response = await axios.get(`${apiUrl}/info?id=${mentionID}`);
          const info = response.data;

          const { name = 'no information', nickname = 'no information', gender = 'no information', birthdate = 'no information', hometown = 'no information', relationship = 'no information', hobby = 'no information', note = 'no information' } = info;

          const infoText =
            `👤 Name: ${name}\n` +
            `🏷️ Nickname: ${nickname}\n` +
            `⚤ Gender: ${gender}\n` +
            `📅 Birthdate: ${birthdate}\n` +
            `🏠 Hometown: ${hometown}\n` +
            `💑 Relationship: ${relationship}\n` +
            `🎯 Hobby: ${hobby}\n` +
            `📝 Note: ${note}`;

          message.send(infoText);
        } catch (error) {
          message.send('❌ An error occurred while loading information.');
        }
      break;

    default:
      const menu = 
        `[⚜️] Usage Guide [⚜️]\n` +
        `[⚜️] ➜ Use the command followed by 'add <case> <content>' to add content\n` +
        `[⚜️] ➜ Use the command followed by 'clear <case>' to clear content\n` +
        `[⚜️] ➜ Use the command 'check' to view your own info\n` +
        `[⚜️] ➜ Use the command 'info <tag>' to view someone else's info\n` +
        `[⚜️] ➜ Supported cases: name, nickname, gender, birth, hometown, relationship, hobby, note\n`;

      message.send(menu);
      break;
  }
}

export default {
  config,
  onCall
};