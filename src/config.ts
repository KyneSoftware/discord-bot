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

  getReportingChannel() {
    return this.getValue("REPORTING_CHANNEL");
  }

  getIntroChannel(){
    return this.getValue("INTRO_CHANNEL");
  }

  getVerifiedColor() {
    return this.getValue("VERIFIED_ROLE_COLOR");
  }

  getIntroMessage(){
    return this.getValue("INTRO_MESSAGE")
  }
}

export { Config };
