require("dotenv").config(); //to use or sensitive key values as env variables.
const { Client, MessageEmbed } = require("discord.js"); // import discord.js module
const { movieEmbed } = require("./components/MovieEmbed"); // message embed template
const https = require("https");
const genreData = require("./assets/list.json");

const client = new Client();
const Prefix = "?";

const TMDB = {
  baseUrl: "https://api.themoviedb.org/3/search/movie?",
  apiKey: process.env.TMDB_KEY,
  imageUrl: "https://image.tmdb.org/t/p/w780",
  videoUrl: "https://api.themoviedb.org/3/movie/",
};
//https://api.themoviedb.org/3/movie/{movie_id}/images?api_key=<<api_key>>&language=en-US
// https://api.themoviedb.org/3/movie/9543/videos?api_key=93fa115269528746f71c1478722e6709&language=en-US
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
            if (MovieInfo.results.length != 0) {
              var videoLink = https.get(
                `${TMDB.videoUrl}${MovieInfo.results[0].id}/videos?api_key=${process.env.TMDB_KEY}&language=en-US`,
                (resp) => {
                  resp.on("data", (d) => {
                    const videoInfo = JSON.parse(d);
                    videoInfo.results.length === 0
                      ? ""
                      : videoInfo.results.map((a) => {
                          message.channel.send(
                            movieEmbed({
                              title: "Trailer",
                              link: `https://youtube.com/watch?v=${a.key}`,
                              color: 0xa33de7,
                              info: a.name,
                              footer: "Youtube",
                            })
                          );
                        });
                  });
                }
              );
              // console.log(videoLink);
            }
            message.channel.send(
              MovieInfo.results.length === 0
                ? "No results found!! Check the spelling"
                : movieEmbed({
                    title: `${
                      MovieInfo.results[0].original_title
                    } (${genreData.genres
                      .filter((a) =>
                        MovieInfo.results[0].genre_ids.includes(a.id)
                      )
                      .map((a) => a.name)
                      .join(" | ")})`,
                    color: 0xa33de7,
                    info: MovieInfo.results[0].overview,
                    image: `${TMDB.imageUrl}${MovieInfo.results[0].poster_path}`,
                    footer: `Released on: ${MovieInfo.results[0].release_date}`,
                    footerIcon:
                      "https://cdn.mee6.xyz/guild-images/726801721829097532/eb7970b806ebf307f873dfc29c55c03774ff744268397142ef6cb1c2bfb12567.jpeg",
                    // link: videoLink,
                  })
            );
          } catch (error) {
            message.channel.send(`error is: ${error}`);
          }
        });
      }
    )
    .on("error", (e) => {
      return e;
    });
};

// function comd(message, name, action) {
//   if (message.content === "?" + name) {
//     action();
//   }
// }

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
      message.channel.send(
        message.content
          .split(" ")
          .slice(1, message.content.length - 1)
          .join(" ")
      );
    });

    comd("search", () => {
      searchQuery(
        message.content
          .split(" ")
          .slice(1, message.content.length - 1)
          .join(" "),
        message
      );
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
