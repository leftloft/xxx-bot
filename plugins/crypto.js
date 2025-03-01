const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {
  MessageType
} = require("@adiwajshing/baileys");
const {
  text
} = MessageType
const coins = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/coins.json"))
);
const requestOptions = {
  method: "GET",
  url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  qs: {
    start: "1",
    limit: "5000",
    convert: "USD",
  },
  headers: {
    "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY ,
  },
  json: true,
  gzip: true,
};

var message;

const crypto = (infor,client,xxx) =>
  new Promise((resolve, reject) => {
    var c = 0;
    arg=infor.arg;
    from=infor.from;

    if (arg.length==1){
      client.sendMessage(from, "```Enter coin symbol.```", text, {
        quoted: xxx,
      });
      reject()
    return}
    if (!coins.includes(arg[1].toUpperCase())) {
   
      client.sendMessage(from,  "```Not listed in coinmarketcap.```", text, {
        quoted: xxx,
      });
      resolve();
    } else {
      axios(requestOptions)
        .then(function (response) {
          response.data.data.forEach((element) => {
            if (element.symbol == arg[1].toUpperCase()) {
              c = element.quote.USD;
              message =
                "*" +
                arg[1].toUpperCase() +
                "* " +
                "/" +
                " " +
                "*USDT*" +
                " 💹" +
                "\n\n" +
                "```Buy price  : ```" +
                c.price.toFixed(3) +
                "\n" +
                "```1h change  : ```" +
                c.percent_change_1h.toFixed(2) +
                " ```%```" +
                "\n" +
                "```24h change : ```" +
                c.percent_change_24h.toFixed(2) +
                " ```%```" +
                "\n" +
                "```market cap : ```" +
                c.market_cap.toFixed(2) +
                "\n\n" +
                "```CoinMarketCap API```" +
                "\n";
            
              client.sendMessage(from,message, text, {
                quoted: xxx,
              });  
              resolve();
            }
          });
        })
        .catch(function (error) {
          console.log(error);
          client.sendMessage(from,"```Error```", text, {
            quoted: xxx,
          }); 
          reject();
        });
    }
  });
module.exports.crypto = crypto;
