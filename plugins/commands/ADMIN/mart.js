import axios from "axios";

export default {
  config: {
    name: "mart",
    permissions: [2],
    aliases: ["market"],
    shortDescription: {
      en: "View items available in the market."
    },
    category: "Market",
    usage: "{p}market [itemID]",
    version: "1.5",
    role: 0,
    author: "LiANE",
  },
  onCall: async ({ args, message }) => {
    const serverURL = "https://neanmartpublic.nealianacagara.repl.co";

    try {
      if (!args[0]) {
        message.reply(`〖 𝗚𝗼𝗮𝘁𝗠𝗮𝗿𝘁 〗
━━━━━━━━━━━━━━━
Available Choices:
-> ${message.body} page < page number >
-> ${message.body} code < item ID >
-> ${message.body} show < item ID >`);
      } else if (args[0] === "code") {
        const itemID = args[1];
        const response = await axios.get(`${serverURL}/api/items/${itemID}`, {
          params: {
            itemID: itemID
          }
        });
        const code = response.data.code;
        const codeX = await axios.get(response.data.pastebinLink);
const codeExtracted = codeX.data;

        if (code || codeX ) {
          message.reply(`〖 𝗚𝗼𝗮𝘁𝗠𝗮𝗿𝘁 〗
━━━━━━━━━━━━━━━
Item Name: ${response.data.itemName}
Item ID: ${response.data.itemID}
Type: ${response.data.type || 'GoatBot' }
Item Code: 
${codeExtracted }`);
        } else {
          message.reply("Item not found.");
        }
      } else if (args[0] === "page") {
        const pageNumber = parseInt(args[1]);
        const response = await axios.get(`${serverURL}/api/items`);
        const items = response.data;
        const totalPages = Math.ceil(items.length / 5);
        const offset = (pageNumber - 1) * 5;

        if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
          message.reply("Invalid page number.");
        } else {
          const pageItems = items.slice(offset, offset + 5);

          const itemDescriptions = pageItems.map(
            (item) =>
              `Item Name: ${item.itemName}
Item ID: ${item.itemID}
Description: ${item.description}
`
          );
          const itemInfo = itemDescriptions.join(`
`);

          message.reply(`〖 𝗚𝗼𝗮𝘁𝗠𝗮𝗿𝘁 〗
━━━━━━━━━━━━━━━
Items available in the market:

${itemInfo}Use ${message.body.split(" ")[0]} [ show | code ] <item id> to view pastebin link or code.

Page: [ ${pageNumber} / ${totalPages} ]`);
        }
      } else if (args[0] === "show") {
        const itemID = args[1];
        const response = await axios.get(`${serverURL}/api/items/${itemID}`);
        const item = response.data;

        if (item && itemID) {
          message.reply(`〖 𝗚𝗼𝗮𝘁𝗠𝗮𝗿𝘁 〗
━━━━━━━━━━━━━━━
Item Name: ${item.itemName}
Item ID: ${item.itemID}
Type: ${item.type || " GoatBot"}
Description: ${item.description}
Pastebin Link: ${item.pastebinLink}`);
        } else {
          message.reply("Item not found.");
        }
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      message.reply("Invalid Item ID" + error.message);
    }
  },
};