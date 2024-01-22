import Bard from "bard-ai";
import path from "path";

const config = {
  name: "bard",
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "XaviaTeam",
};

const bard = new Bard({
  "__Secure-1PSID": "fAgEajIXrkTFTxCy_F-Yu7GMpwfKJIndNXlGcDHKRaznIuraTYDa1wEWr5R3-KfDWVrZVA.",
  "__Secure-1PSIDTS": process.env.BARD_1PSIDTS,
});

if (!global.bard_data) {
  global.bard_data = new Map();
}

async function onCall({ message, args }) {
  const { reply, messageReply, senderID } = message;

  if (!global.bard_data.has(senderID)) {
    global.bard_data.set(senderID, bard.createChat());
  }
  if ((args[0] === "reset" || args[0] === "clear") && args.length == 1) {
    global.bard_data.delete(senderID);
    return reply("Conversation history has been deleted!");
  }

  /**
   * @type {import("bard-ai").Chat}
   */
  const chat = global.bard_data.get(senderID);

  if (
    messageReply &&
    messageReply.attachments &&
    messageReply.attachments[0] &&
    messageReply.attachments[0].type === "photo"
  ) {
    const { url } = messageReply.attachments[0];
    const pathImage = path.resolve(
      global.cachePath,
      `${senderID}_${Date.now()}.jpg`
    );

    try {
      await global.downloadFile(pathImage, url);

      message.react("⏳");

      /**
       * @type {import("bard-ai").IAskResponseJSON}
       */
      const response = await chat.ask(args.join(" "), {
        format: "json",
        image: pathImage,
      });

      const msg = {
        body: response.content,
        attachment: [],
      };

      if (response.images?.length > 0) {
        for (const img of response.images) {
          const imgStream = await global
            .getStream(img.url)
            .catch(() => null);
          if (imgStream) {
            msg.attachment.push(imgStream);
          }
        }
      }

      reply(msg)
        .then((d) => {
          d.addReplyEvent({
            callback: handleReply
          });
          message.react("☑️");
        });
    } catch (error) {
      console.error(error);
    } finally {
      if (global.isExists(pathImage)) {
        global.deleteFile(pathImage);
      }
    }
  } else {
    message.react("⏳");

    /**
     * @type {import("bard-ai").IAskResponseJSON}
     */
    const response = await chat.ask(args.join(" "), {
      format: "json",
    });

    const msg = {
      body: response.content,
      attachment: [],
    };

    if (response.images?.length > 0) {
      for (const img of response.images) {
        const imgStream = await global.getStream(img.url).catch(() => null);
        if (imgStream) {
          msg.attachment.push(imgStream);
        }
      }
    }

    reply(msg)
      .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
        message.react("☑️");
      });
  }
}

async function handleReply({ message, eventData }) {
  const { author } = eventData;
  const prompt = message.body;

  if (prompt.length == 0) return;

  await message.react("⏳");

  /**
   * Retrieve chat based on author
   */
  const chat = global.bard_data.get(author);

  /**
   * @type {import("bard-ai").IAskResponseJSON}
   */
  const response = await chat.ask(prompt, {
    format: "json",
  });

  const msg = {
    body: response.content,
    attachment: [],
  };

  if (response.images?.length > 0) {
    for (const img of response.images) {
      const imgStream = await global.getStream(img.url).catch(() => null);
      if (imgStream) {
        msg.attachment.push(imgStream);
      }
    }
  }

  return message.reply(msg)
    .then((d) => {
      d.addReplyEvent({
        callback: handleReply
      });
      message.react("☑️");
    });
}

export default {
  config,
  onCall,
};
