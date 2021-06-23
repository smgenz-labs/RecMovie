const Dot = require("dotenv");

Dot.config();

const { Client } = require("discord.js");

const client = new Client();

const Prefix = "?";

function comd(message, name, action) {
  if (message.content === "?" + name) {
    action();
  }
}

client.login(process.env.BOT_TOK);

client.on("ready", () => console.log(`${client.user.username} Up and running`));

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content[0] === "?") {
    comd(message, "lol", () => {
      message.channel.send("HAHAHAHAHAHAHA!!!");
    });
    // comd(message, "");
  }
});
