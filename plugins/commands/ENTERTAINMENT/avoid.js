export default {
  config: {
    name: "avoid",
    version: "1.0",
    author: "Samir",
    cooldown: 5,
    description: "avoid someone in nepal",
    usage: ""
  },

  onCall: async function({ message }) {
    var id = Object.keys(message.mentions)[0] || message.senderID;
    const img = `https://milanbhandari.imageapi.repl.co/avoid?uid=${id}`;
    const form = {
      body: `This MF Must Be Avoided! ⚠️`
    };
    form.attachment = [];
    form.attachment[0] = await global.getStream(img);
    message.reply(form);
  }
};
