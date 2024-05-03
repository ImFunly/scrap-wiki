const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

const url = "https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap";

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const results = [];

    $("#mw-pages a").each(async (index, element) => {
      const pageUrl = $(element).attr("href");

      const pageResponse = await axios.get(
        `https://es.wikipedia.org${pageUrl}`
      );
      const pageHtml = pageResponse.data;
      const $page = cheerio.load(pageHtml);

      const title = $page("h1").text();
      const images = [];
      $page("img").each((index, element) => {
        images.push($(element).attr("src"));
      });
      const texts = [];
      $page("p").each((index, element) => {
        texts.push($(element).text());
      });

      results.push({ title, images, texts });
    });

    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("express está funcionando en el puerto http://localhost:3000");
});

// Haga lo que haga no me extrae los datos, me responde un array vacío, en el ejercicio de clase me sucedía lo mismo...
