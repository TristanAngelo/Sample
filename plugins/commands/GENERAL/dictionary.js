import axios from 'axios';

const config = {
  name: 'dictionary',
  aliases: ['dict'],
  version: '1.5',
  credits: 'Otineeeeey',
  cooldown: 5,
  description: 'Lookup at dictionary',
  usage: '[word]'
};

async function onCall({ args, message }) {
  if (args[0]) {
    try {
      const res = await axios.get(encodeURI(`https://api.dictionaryapi.dev/api/v2/entries/en/${args.join(" ").trim().toLowerCase()}`));
      let data = res.data[0];
      let example = data.meanings[0].definitions.example;
      let phonetics = data.phonetics;
      let meanings = data.meanings;
      let msg_meanings = '';

      meanings.forEach(items => {
        example = items.definitions[0].example ? `\n*example:\n \"${items.definitions[0].example[0].toUpperCase() + items.definitions[0].example.slice(1)}\"` : '';
        msg_meanings += `\n• ${items.partOfSpeech}\n ${items.definitions[0].definition[0].toUpperCase() + items.definitions[0].definition.slice(1) + example}`;
      });

      let msg_phonetics = '';
      phonetics.forEach(items => {
        let text = items.text ? `\n    /${items.text}/` : '';
        msg_phonetics += text;
      });

      let msg = `❰ ❝ ${data.word} ❞ ❱` + msg_phonetics + msg_meanings;
      return message.reply(msg);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return message.reply('❌ | No Definitions Found');
      }
    }
  } else {
    message.reply('⚠️ | Missing input!');
  }
}

export default {
  config,
  onCall
};
