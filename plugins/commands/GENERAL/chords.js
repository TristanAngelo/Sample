import tabs from "ultimate-guitar";

export default {
  config: {
    name: "chords",
    aliases: [],
    version: "1.0",
    author: "Joshua Sy & kshitiz (Converted by Grim)",
    description: "Search Chords",
    guide: "[chords song title]"
  },
  onCall: async function({ message, args }) {
    let qwerty = args.join(" ");

    if (qwerty === "") {

      message.reply("Please type 'chords' with the song name");
      return;
    }

    try {
      const res = await tabs.firstData(qwerty);

      if (!res) {

        console.error(`Chords for '${qwerty}' not found.`);

        message.reply(`Chords for '${qwerty}' not found.`);
      } else {
        var title = res.title;
        var chords = res.chords;
        var type = res.type;
        var key = res.key;
        var artist = res.artist;

        message.reply(
          `Artist: ${artist}\nTitle: ${title}\nType: ${type}\nKey: ${key}\n——Here’s the chords——\n\n${chords}\n\n——End——`
        );
      }
    } catch (err) {

      console.error("[ERR] " + err);

      message.reply("[ERR] An error occurred while fetching chords.");
    }
  }
};
