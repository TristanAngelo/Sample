import axios from 'axios';

const typewriter = {
  a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
  n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
  A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
  N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
  ' ': ' ',
};

const config = {
  name: 'poetry',
  version: '1.0.0',
  credits: 'August Quinn(Converted by Grim)',
  description: 'Get random poetry by an author.',
  usage: '[author]',
  cooldowns: 5,
};

async function onCall({ api, args, message }) {

  const threadID = message.threadID;
  const messageID = message.messageID;
  const author = args.join(' ');

  if (!author) {
    global.api.sendMessage('Please provide an author name to get poetry.', threadID, messageID);
    return;
  }

  try {
    message.react("⏳");
    const response = await axios.get(`https://poetrydb.org/author/${encodeURIComponent(author)}`);

    if (response.status === 200 && response.data && response.data.length > 0) {
      const randomPoetry = response.data[Math.floor(Math.random() * response.data.length)];
      const poem = randomPoetry.lines.join('\n').split('').map(char => typewriter[char] || char).join('');
      const authorFormatted = author.split('').map(char => typewriter[char] || char).join('');
      message.react("✅");
      global.api.sendMessage(`📜 𝗥𝗔𝗡𝗗𝗢𝗠 𝗣𝗢𝗘𝗧𝗥𝗬 📜\n\n✏️:  ${authorFormatted}\n━━━━━━━━━━━━━\n${poem}`, threadID, messageID);
    } else {
      message.react("⚠");
      global.api.sendMessage(`No poetry found for author: ${author}`, threadID, messageID);
    }
  } catch (error) {
    message.react("❌")
    console.error(error);
    global.api.sendMessage('An error occurred while fetching poetry data.', threadID, messageID);
  }
}

export default {
  config,
  onCall,
};
