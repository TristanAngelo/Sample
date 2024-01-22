import axios from "axios";

export default {
  config: {
    name: "transcribe",
    version: "1.1",
    author: "MILAN (Converted by Grim)",
    cooldown: 10,
    description:  "The `transcribe` command allows you to extract texts from videos or audios. Simply reply to an audio or video, and the command will use the API to extract the text from the audio or video. The extracted text will be sent back as a reply to your message.",
    usage: "[reply to an audio/video]"
    },

  onCall: async function({ message }) {
    try {
      if (!message.messageReply.attachments || message.messageReply.attachments.length === 0) {
        return message.reply('Please reply to an audio or video.');
      }

      const link = message.messageReply.attachments[0].url;
      const response = await axios.get(`https://milanbhandari.imageapi.repl.co/transcribe?url=${encodeURIComponent(link)}`);
      const text = response.data.transcript;

      if (text) {
        message.reply({
          body: `Converted Audio: ${text}`
        });
      } else {
        message.reply("Failed to transcribe the audio or video.");
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the request.");
    }
  }
};