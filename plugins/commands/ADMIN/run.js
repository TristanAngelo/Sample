const config = {
  name: "run",
  aliases: ["eval", "execute", "exec"],
  permissions: [2],
  description: "Run bot scripts",
  usage: "<script>",
  credits: "ndt22w",
  isAbsolute: true
};

function onCall({ message, args }) {
  import("child_process").then(mdl => {
    message.reply("✅ | Success!")
    mdl.exec((args.join(" ")), (e, stdout) => {
      if (e) {
        // Handle error and notify user
        console.error("An error occurred:", e);
        message.reply("An error occurred.\n\n" + e);
        return; // Prevent further processing
      }
      message.reply(stdout);
    })
  })
}

export default {
  config,
  onCall
}