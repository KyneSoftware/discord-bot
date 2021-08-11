import { Client } from "@typeit/discord";

//Channel type isn't done properly in "@typeit/discord"(?) Doesn't include send method
const { Channel } = require("discord.js");

class DiscordBot {
  client: Client;
  token: string;
  channel: string;
  ready: boolean;

  constructor(token: string, channel: string, profilePic: string, name: string, color: string) {
    this.token = token;
    this.channel = channel;
    this.ready = false;
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
      this.setProfilePicture(profilePic);
      this.setName(name);
      this.setRole(name, color) 
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
      this.client.user.setPresence(
        {
          status: 'online',
          activity: {
            name: activity,
            type: 'WATCHING'
          }
        }).catch(error => console.error(error))
    }
  }

  public setServerName(name: string) {
    if (this.ready) {
      this.client.guilds.cache.map(guild => {
        let guildMember = guild.member(this.client.user)
        guildMember.setNickname(name)
      });
    }
  }

  private setRole(role: string, color: string) {
    if (this.ready) {
      this.client.guilds.cache.map(async guild => {
        let guildRole = guild.roles.cache.find(r => r.name === role)
        if (!guildRole) {
          guildRole = await guild.roles.create({
            data: {
              name: role,
              color: color,
              hoist: true
            }
          })
        }

        let guildMember = guild.member(this.client.user)
        guildMember.roles.add(guildRole)
      });
    }
  }

  private setName(name: string) {
    if (this.ready) {
      this.client.user.setUsername(name).catch(error => console.error(error))
    }
  }

  private setProfilePicture(url: string) {
    if (!!url && this.ready) {
      this.client.user.setAvatar(url).catch(error => console.error(error))
    }
  }
}

export { DiscordBot };
