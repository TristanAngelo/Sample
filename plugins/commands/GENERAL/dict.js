import axios from 'axios';

export const config = {
  name: "dict",
  version: "1.4",
  permission: 0,
  credits: "Hazeyy",
  description: "( 𝘿𝙞𝙘𝙩𝙞𝙤𝙣𝙖𝙧𝙮 )",
  usage: "( Dictionary with Images )",
  cooldown: 3,
};

export async function onCall({ message }) {
  try {
    const args = message.body.split(/\s+/);
    args.shift();

    const word = args.join(" ");

    try {
      const response = await axios.get("https://hazeyy-apis-combine.kyrinwu.repl.co");
      if (Object.prototype.hasOwnProperty.call(response.data, "error")) {
        return message.reply(response.data.error);
      }
    } catch (error) {
      console.error("🔴 | 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍:", error);
      message.reply("🔴 | 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍." + error.data);
      return;
    }

    if (!word) {
      return message.reply("🖋️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚚𝚞𝚎𝚛𝚢 𝚝𝚘 𝚜𝚎𝚊𝚛𝚌𝚑 𝚘𝚗 𝚍𝚒𝚌𝚝𝚒𝚘𝚗𝚊𝚛𝚢.\n\n𝙴𝚡𝚊𝚖𝚙𝚕𝚎: 𝚍𝚒𝚌𝚝 [ 𝚌𝚊𝚝 ]");
    }

    const wait = await message.reply("🔍 | 𝚂𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐 𝚏𝚘𝚛 𝚍𝚎𝚏𝚒𝚗𝚒𝚝𝚒𝚘𝚗...");

    const response = await axios.get(`https://hazeyy-apis-combine.kyrinwu.repl.co/api/try/dictionary?word=${word}`);
    console.log('📖 | 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎:', response.data);

    const { phonetic, definition, example, image } = response.data;

    setTimeout(() => {
      global.api.unsendMessage(wait.messageID);

      message.reply(`🎓 | 𝗗𝗶𝗰𝘁𝗶𝗼𝗻𝗮𝗿𝘆\n\n𝚆𝚘𝚛𝚍: '${word}'\n\n𝙿𝚑𝚘𝚗𝚎𝚝𝚒𝚌: '${phonetic}'\n\n𝙳𝚎𝚏𝚒𝚗𝚒𝚝𝚒𝚘𝚗: '${definition}'\n\n𝙴𝚡𝚊𝚖𝚙𝚕𝚎: '${example}'\n\n𝙸𝚖𝚊𝚐𝚎: '${image}'`);
    }, 6000);
  } catch (error) {
    console.error('🔴 𝙴𝚛𝚛𝚘𝚛:', error.message);

    if (error.response && error.response.status === 404) {
      message.reply({
        body: '⚠️ | 𝙽𝚘 𝚍𝚎𝚏𝚒𝚗𝚒𝚝𝚒𝚘𝚗 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚠𝚘𝚛𝚍. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚎𝚌𝚔 𝚝𝚑𝚎 𝚜𝚙𝚎𝚕𝚕𝚒𝚗𝚐 𝚊𝚗𝚍 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗.'
      });
    } else {
      message.reply({
        body: '🔴 | 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚝𝚑𝚎 𝚍𝚒𝚌𝚝𝚒𝚘𝚗𝚊𝚛𝚢 𝚍𝚊𝚝𝚊. 𝚙𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗.'
      });
    }
  }
};
