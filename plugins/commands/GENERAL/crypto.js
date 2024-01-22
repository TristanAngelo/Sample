import fs from 'fs';
import request from 'request';
import path from 'path';
import axios from 'axios';

export const config = {
  name: "crypto",
  version: "1.0.0",
  credits: "SaikiDesu",
  description: "daily update about crypto coin",
  usage: "",
  cooldown: 5
};

export async function onCall({ message, args }) {

  //let song = args.join(" ");

  var type;
  switch (args[0]) {
    case "bitcoin":
    case "Bitcoin":
    case "BTC":
    case "btc":
      type = "btc-bitcoin";
      break;
    case "ethereum":
    case "thereum":
    case "ETH":
    case "eth":
      type = "eth-ethereum";
      break;
    case "tether":
    case "Tether":
      type = "usdt-tether";
      break;
    case "binance":
    case "Binance":
    case "Bnb":
    case "BNB":
      type = "bnb-binance-coin";
      break;
    case "USD Coin":
    case "usd coin":
    case "USD":
      type = "usdc-usd-coin";
      break;
    case "hex":
    case "HEX":
      type = "hex-hex";
      break;
    case "solana":
    case "Solana":
    case "SOL":
    case "sol":
      type = "sol-solana";
      break;
    case "Xrp":
    case "xrp":
    case "XRP":
      type = "xrp-xrp";
      break;
    case "terra":
    case "Terra":
    case "Luna":
    case "luna":
      type = "luna-terra";
      break;
    case "ada":
    case "ADA":
    case "cardano":
    case "Cardano":
      type = "ada-cardano";
      break;
    case "ust":
    case "UST":
    case "terrausd":
    case "Terrausd":
      type = "ust-terrausd";
      break;
    case "doge":
    case "DOGE":
    case "dogecoin":
    case "Dogecoin":
      type = "doge-dogecoin";
      break;
    default:
      return message.reply(`⚠️Please put type of crypto coin.\n\nLists of Coin Available:\nBitcoin\nEthereum\nTether\nBinance\nUSD Coin\nHEX\nSolana\nXRP\nTerra\nADA\nUST\nDOGE`);
      break;
  }

  //const res = await 

  axios.get(`https://api.coinpaprika.com/v1/ticker/${type}`).then(res => {

    var name = res.data.name;
    var symbol = res.data.symbol;
    var rank = res.data.rank;
    var price_usd = res.data.price_usd;
    var price_btc = res.data.price_btc;
    var percent_24h = res.data.percent_change_24h;
    const imgPath = path.join(global.cachePath, `${message.threadID}_crypto.jpg`);

    var callback = function() {
      message.reply({
        body: `Name: ${name}\nSymbol: ${symbol}\nRank: ${rank}\nUSD Price: ${price_usd}\nBTC Price: ${price_btc}\nPercent: ${percent_24h}`, attachment: fs.createReadStream(imgPath)
      }, () => fs.unlinkSync(imgPath));
    };
    request(`https://static.coinpaprika.com/coin/${type}/logo.png?rev=10557311`).pipe(fs.createWriteStream(imgPath)).on("close", callback);
  })
}