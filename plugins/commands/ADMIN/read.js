import path from "path";
import fs from "fs";

const config = {
    name: "read",
    description: "Read from url/file",
    usage: "[-c|-a|-j|-st] [url/filename]",
    cooldown: 3,
    permissions: [2],
    credits: "Eien Mojiki",
    version: "0.0.1-xaviabot-port-remake",
};

async function onCall({ message, args }) {
    const opt = args[0];

    switch (opt) {
        case "-c": {
            const filename = args[1];
            if (filename == undefined || filename == "") {
                message.reply("Please specify a filename.");
                return;
            }

            const pluginPath = findPlugin(filename);
            if (pluginPath == null) {
                message.reply(`Cannot find plugin '${filename}'.`);
                return;
            }

            const tmpPath = createCopy(pluginPath);

            try {
                await message.reply({
                    attachment: fs.createReadStream(tmpPath),
                });
            } catch (err) {
                console.error(err);
                message.reply("An error occurred while reading the file.");
            } finally {
                if (fs.existsSync(tmpPath)) {
                    fs.unlinkSync(tmpPath);
                }
            }

            break;
        }
        case "-a": {
            const url = args[1];
            if (url == undefined || url == "") {
                message.reply("Please specify a URL.");
                return;
            }

            const urlData = await global
                .GET(url)
                .then((res) => res.data)
                .catch((err) => {
                    console.error(err);
                    return null;
                });

            if (urlData == null) {
                message.reply("An error occurred while reading the URL.");
                return;
            }

            await message.reply(typeof urlData == "object" ? JSON.stringify(urlData, null, 2) : urlData);
            break;
        }
        case "-st": {
            const url = args[1];
            if (url == undefined || url == "") {
                message.reply("Please specify a URL.");
                return;
            }

            const streamData = await global.getStream(url).catch((err) => {
                console.error(err);
                return null;
            });

            if (streamData == null) {
                message.reply("An error occurred while reading the URL.");
                return;
            }

            await message.reply({
                attachment: streamData,
            });
            break;
        }
        default:
            message.reply(
                `Invalid option '${opt}'. Please use '-c' to read a file, '-a' to read data from a URL, or '-st' to read a stream from a URL.`
            );
            break;
    }
}

function findPlugin(filename) {
    const commandPath = path.join(process.cwd(), "plugins", "commands");

    const categories = fs
        .readdirSync(commandPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    for (const cate of categories) {
        const files = fs
            .readdirSync(path.join(commandPath, cate), { withFileTypes: true })
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name);

        for (const file of files) {
            if (file == filename || file == `${filename}.js`) {
                return path.join(commandPath, cate, file);
            }
        }
    }

    return null;
}

function createCopy(filePath) {
    const filename = path.basename(filePath);
    const tmpPath = path.join(
        global.cachePath,
        filename.replace(".js", ".txt")
    );

    fs.copyFileSync(filePath, tmpPath);

    return tmpPath;
}

export default {
    config,
    onCall,
};