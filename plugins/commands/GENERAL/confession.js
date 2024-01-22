import fetch from 'node-fetch';

const config = {
  name: "confession",
  aliases: ["confess"],
  credits: "Grim",
  description: "Send a confession to someone.",
  usage: "[fblink] | [message] | [codename]",
  permissions: [0],
  cooldown: 7,
  version: "1.0.1"
};

async function onCall({ message, args, prefix }) {
  const input = args.join(" ");

  if (!input.includes("|")) {
    return message.reply(`Please provide an fblink. Usage: ${prefix}${config.name} [fblink] | [message] | [codename]`);
  }

  const [fblink, confessMessage, codename] = input.split("|").map((part) => part.trim());

  const match = fblink.match(/[?&]id=(\d+)/);
  if (match) {
    const id = match[1];
    const formattedMessage = createFormattedMessage(confessMessage, codename);
    global.api.sendMessage(formattedMessage, id, () => {
      message.reply("💌 | Confession has been sent successfully!");
    });
  } else {
    try {
      const response = await fetch('https://id.traodoisub.com/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          link: fblink,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const id = result.id;

      const formattedMessage = createFormattedMessage(confessMessage, codename);
      global.api.sendMessage(formattedMessage, id, () => {
        message.reply("💌 | Confession has been sent successfully!");
      });
    } catch (error) {
      console.error("Error making the POST request:", error);
      message.reply("📭 | I'm sorry but your confession has been failed to send. It might be a good time to have a direct conversation with that person and express your feelings. (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)");
    }
  }
}

function createFormattedMessage(confessMessage, codename) {
  const codenamePart = codename ? `\n— ${codename}` : '';
  return `━━💌 [Confession Time] 💌━━\n\n𝖲𝗈𝗆𝖾𝗈𝗇𝖾 𝗁𝖺𝗌 𝖺 𝖼𝗈𝗇𝖿𝖾𝗌𝗌𝗂𝗈𝗇 𝖿𝗈𝗋 𝗒𝗈𝗎!\n\n📜 | 𝖬𝖾𝗌𝗌𝖺𝗀𝖾:\n      ⤷ ${confessMessage}\n\n${codenamePart}\n━━━━━━━━━━━━━━\nℹ️ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗄𝖾 𝖺 𝗆𝗈𝗆𝖾𝗇𝗍 𝗍𝗈 𝗋𝖾𝖺𝖽 𝖺𝗇𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝖽.`;
}

export default {
  config,
  onCall,
};
