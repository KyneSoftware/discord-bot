import { Client } from "@typeit/discord";
import { Role, Guild, TextChannel } from "discord.js";
import { Config } from "./config";

//Channel type isn't done properly in "@typeit/discord"(?) Doesn't include send method
const { Channel } = require("discord.js");

class DiscordBot {
  client: Client;
  token: string;
  channel: string;
  ready: boolean;
  verifiedRole: string;
  config: Config;

  constructor(
    token: string,
    channel: string,
    profilePic: string,
    name: string,
    color: string
  ) {
    this.token = token;
    this.channel = channel;
    this.ready = false;

    this.verifiedRole = "Obol Community";
    this.config = new Config(process.env);

    this.start(profilePic, name, color);
  }

  private start(profilePic: string, name: string, color: string) {
    this.client = new Client({
      classes: [
        `${__dirname}/*discord.ts`, // glob string to load the classes
        `${__dirname}/*discord.js`, // If you compile using "tsc" the file extension change to .js
      ],
      silent: false,
      variablesChar: ":",
    });

    this.client.on("ready", () => {
      this.ready = true;
      this.cacheIntroMessage();
      //this.setProfilePicture(profilePic);
      //this.setName(name);
      //this.createRoles(name, color);
    });

    this.client.on("messageReactionAdd", (reaction, user) => {
      let message = reaction.message,
        emoji = reaction.emoji;

      let verifiedRoles: { [id: string]: Role } = this.getRoles(
        "Obol Community",
        this.config.getVerifiedColor()
      );

      if (message.id === this.config.getIntroMessage()) {
        console.log()
        if (emoji.name.includes("obol")) {
          verifiedRoles[message.guild.id];
          
          message.guild
            .member(user.id)
            .roles.add(verifiedRoles[message.guild.id]);
        }
      }
    });

    this.client.login(this.token);
  }

  public sendMessage(message: string) {
    if (this.ready) {
      this.client.channels.fetch(this.channel).then((c: typeof Channel) => {
        c.send(message);
      });
    }
  }

  public setActivity(activity: string) {
    if (this.ready) {
      this.client.user
        .setPresence({
          status: "online",
          activity: {
            name: activity,
            type: "WATCHING",
          },
        })
        .catch((error) => console.error(error));
    }
  }

  public setServerName(name: string) {
    if (this.ready) {
      this.client.guilds.cache.map((guild) => {
        let guildMember = guild.member(this.client.user);
        guildMember.setNickname(name);
      });
    }
  }

  private createRoles(role: string, color: string) {
    if (this.ready) {
      const botRoles: { [id: string]: Role } = this.getRoles(role, color);
      for (let guildId in botRoles) {
        this.client.guilds.fetch(guildId).then((guild) => {
          let guildMember = guild.member(this.client.user);
          guildMember.roles.add(botRoles[guildId]);
        });
      }
    }
  }

  private getRoles(role: string, color: string): { [id: string]: Role } {
    let guildRoles: { [id: string]: Role } = {};
    this.client.guilds.cache.map(async (guild) => {
      let guildRole = guild.roles.cache.find((r) => r.name == role);
      if (!guildRole) {
        guildRole = await guild.roles.create({
          data: {
            name: role,
            color: color,
            hoist: true,
          },
        });
      }

      guildRoles[guild.id] = guildRole;
    });

    return guildRoles;
  }

  private setName(name: string) {
    if (this.ready) {
      this.client.user.setUsername(name).catch((error) => console.error(error));
    }
  }

  private setProfilePicture(url: string) {
    if (!!url && this.ready) {
      this.client.user.setAvatar(url).catch((error) => console.error(error));
    }
  }

  private cacheIntroMessage() {
    let c = this.client.channels.cache
      .get(this.config.getIntroChannel()) as TextChannel;
    c.messages.fetch();
  }
}

export { DiscordBot };
