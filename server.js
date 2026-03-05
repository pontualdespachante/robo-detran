const express = require("express");
const { chromium } = require("playwright");

const app = express();

/* aceita JSON */
app.use(express.json());

/* libera chamadas do navegador (Lovable, Hoppscotch etc) */
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  next();
});

/* rota simples para verificar se o servidor está online */
app.get("/", (req,res)=>{
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

    await page.goto(
      "https://detran.mg.gov.br/veiculos/transferencias/taxa-para-transferir-propriedade-de-veiculo-comprador/index/2",
      { waitUntil: "networkidle" }
    );

    /* ETAPA 1 */

    await page.fill('input[name="placa"]', dados.placa);
    await page.fill('input[name="chassi"]', dados.chassi);

    await page.selectOption('select[name="tipoDocumento"]', dados.tipoDocumento);

    await page.fill('input[name="cpfCnpj"]', dados.cpfCnpj);

    await page.click('button:has-text("Próximo")');

    /* aguarda página seguinte */

    await page.waitForURL("**completar-dados**");

    /* ETAPA 2 */

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

    if(browser){
      await browser.close();
    }

    res.status(500).json({
      status: "erro",
      mensagem: erro.message
    });

  }

});

/* porta dinâmica para Railway */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Robo DETRAN rodando na porta", PORT);
});
