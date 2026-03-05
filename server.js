const express = require("express");
const { chromium } = require("playwright");

const app = express();

/* aceita JSON */
app.use(express.json());

/* rota simples para teste */
app.get("/", (req, res) => {
  res.send("robo detran online");
});

app.post("/gerar", async (req, res) => {

  const dados = req.body;

  let browser;

  try {

    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox","--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://example.com");

    const html = await page.content();

    await browser.close();

    res.json({
      status: "ok",
      pagina: html
    });

  } catch (erro) {

    if(browser){
      await browser.close();
    }

    res.status(500).json({
      status: "erro",
      mensagem: erro.message
    });

  }

});

/* PORTA OBRIGATÓRIA RAILWAY */

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
