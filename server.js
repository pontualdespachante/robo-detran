const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/gerar', async (req, res) => {

  const dados = req.body;

  try {

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://detran.mg.gov.br/veiculos/transferencias/taxa-para-transferir-propriedade-de-veiculo-comprador/index/2");

    await page.fill('input[name="placa"]', dados.placa);
    await page.fill('input[name="chassi"]', dados.chassi);

    await page.click('button:has-text("Próximo")');

    await page.waitForTimeout(3000);

    const pdf = await page.pdf();

    await browser.close();

    res.json({
      status: "ok",
      pdf_base64: pdf.toString('base64')
    });

  } catch (e) {

    res.json({
      status: "erro",
      mensagem: e.message
    });

  }

});

app.listen(3000, () => {
  console.log("Robô rodando na porta 3000");
});