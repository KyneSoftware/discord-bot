class Config {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      console.error(`config error - missing environment variable: ${key}`);
      throw new Error(`Please set your ${key} in a .env file`);
    }

    return value;
  }

  getTokenAddress() {
    return this.getValue("TOKEN_ADDRESS");
  }

  getDiscordToken() {
    return this.getValue("DISCORD_TOKEN");
  }

  getDiscordChannel() {
    return this.getValue("DISCORD_CHANNEL");
  }
}

export { Config };
