require("dotenv").config();

import axios from "axios";
import { Config } from "./config";
import { DiscordBot } from "./discord";

const config = new Config(process.env);

const discordBot: DiscordBot = new DiscordBot(
  config.getDiscordToken(),
  config.getDiscordChannel(),
  process.env.AVATAR,
  process.env.NAME,
  process.env.ROLE_COLOR
);

const UNI_GRAPH = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
const REQ = `{"query":"{bundles(first:1){ethPriceUSD} token(id:\\"${config.getTokenAddress()}\\"){symbol derivedETH}}"}`

setInterval(() => {
  axios.post(UNI_GRAPH, REQ)
    .then(res => res.data.data)
    .then(data => {
      let ethPrice = data.bundles[0].ethPriceUSD

      let tokenPrice = (ethPrice/1).toFixed(2)
      let tokenTicker = 'ETH'
      if(config.getTokenAddress() !== '0x0'){
        tokenPrice = (ethPrice / data.token.derivedETH).toFixed(2)
        tokenTicker = data.token.symbol
      }
      
      discordBot.setActivity(`$${tokenTicker}`)
      discordBot.setServerName(`${tokenTicker} - $${tokenPrice}`)
    })
    .catch(err => {
      console.error(err)
    })
}, 20000)
