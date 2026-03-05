const express = require("express");
const { chromium } = require("playwright");

const app = express();
app.use(express.json());

app.post("/gerar", async (req, res) => {

  const dados = req.body;

  try {

    const browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://detran.mg.gov.br/veiculos/transferencias/taxa-para-transferir-propriedade-de-veiculo-comprador/index/2");

    await page.waitForLoadState("networkidle");

    // ETAPA 1

    await page.fill('input[name="placa"]', dados.placa);
    await page.fill('input[name="chassi"]', dados.chassi);

    await page.selectOption('select[name="tipoDocumento"]', dados.tipoDocumento);

    await page.fill('input[name="cpfCnpj"]', dados.cpfCnpj);

    await page.click('button:has-text("Próximo")');

    // aguarda carregar segunda página

    await page.waitForURL("**/completar-dados/**");

    // ETAPA 2

    await page.fill('input[name="renavam"]', dados.renavam);
    await page.fill('input[name="valorRecibo"]', dados.valorRecibo);

    await page.fill('input[name="dataAquisicao"]', dados.dataAquisicao);

    await page.fill('input[name="numeroCrv"]', dados.numeroCrv);

    await page.selectOption('select[name="ufOrigem"]', dados.ufOrigem);

    await page.fill('input[name="nomeAdquirente"]', dados.nome);

    await page.fill('input[name="documentoIdentidade"]', dados.rg);

    await page.fill('input[name="orgaoExpedidor"]', dados.orgao);

    await page.selectOption('select[name="ufDocumento"]', dados.ufDocumento);

    await page.fill('input[name="cep"]', dados.cep);

    await page.fill('input[name="endereco"]', dados.endereco);

    await page.fill('input[name="numero"]', dados.numero);

    await page.fill('input[name="bairro"]', dados.bairro);

    await page.selectOption('select[name="categoria"]', dados.categoria);

    await page.selectOption('select[name="atividade"]', dados.atividade);

    await page.click('button:has-text("Próximo")');

    await page.waitForLoadState("networkidle");

    const html = await page.content();

    await browser.close();

    res.json({
      status: "ok",
      pagina: html
    });

  } catch (erro) {

    res.json({
      status: "erro",
      mensagem: erro.message
    });

  }

});

app.listen(3000, () => {
  console.log("Robo DETRAN rodando");
});
