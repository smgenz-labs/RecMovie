require("dotenv").config(); //to use or sensitive key values as env variables.
const { Client, MessageEmbed } = require("discord.js"); // import discord.js module
const { movieEmbed } = require("./components/MovieEmbed"); // message embed template
const https = require("https");

const client = new Client();
const Prefix = "?";

const TMDB = {
  baseUrl: "https://api.themoviedb.org/3/search/movie?",
  apiKey: process.env.TMDB_KEY,
};
//api_key={APIKEY}&language=en-US&query=prince%20of%20persia&page=1&include_adult=false

const searchQuery = (query, message) => {
  var movie = "some";
  https
    .get(
      `${TMDB.baseUrl}api_key=${TMDB.apiKey}&language=en-US&query=${query
        .split(" ")
        .join("%20")}&page=1&include_adult=false`,
      (resp) => {
        resp.on("data", (d) => {
          try {
            const MovieInfo = JSON.parse(d);
            message.channel.send(
              MovieInfo.results.length === 0
                ? "No results found!! Check the spelling"
                : MovieInfo.results[0].overview
            );
          } catch (error) {
            message.channel.send(error);
          }
          // console.log(JSON.stringify(MovieInfo));
        });
      }
    )
    .on("error", (e) => {
      return e;
    });
};

function comd(message, name, action) {
  if (message.content === "?" + name) {
    action();
  }
}

client.on("ready", () => console.log(`${client.user.username} Up and running`));

client.on("message", (message) => {
  function comd(name, action) {
    if (message.content.split(" ")[0] === Prefix + name) {
      action();
    }
  }

  if (message.author.bot) return;

  if (message.content[0] === Prefix) {
    comd("lol", () => {
      message.channel.send("HAHAHAHAHAHAHA!!!");
    });

    comd("repeat", () => {
      console.log(
        message.content
          .split(" ")
          .slice(1, message.content.length - 1)
          .join(" ")
      );
      message.channel.send(
        message.content
          .split(" ")
          .slice(1, message.content.length - 1)
          .join(" ")
      );
    });

    comd("search", () => {
      // console.log(

      // );
      searchQuery(
        message.content
          .split(" ")
          .slice(1, message.content.length - 1)
          .join(" "),
        message
      );
      // message.channel.send(

      // );
    });

    comd("embed", () => {
      const embed = movieEmbed({
        title: "Movie Title",
        color: 0xa33de7,
        info: "info",
        image: "https://smgenz-official.web.app/logoanime.d0208d98.gif",
        footer: "Have a nice day watching this movie!!",
        footerIcon:
          "https://cdn.mee6.xyz/guild-images/726801721829097532/eb7970b806ebf307f873dfc29c55c03774ff744268397142ef6cb1c2bfb12567.jpeg",
        link: "https://google.co.in",
      });
      // Send the embed to the same channel as the message
      message.channel.send(embed);
    });
  }
});

client.login(process.env.BOT_TOK);
