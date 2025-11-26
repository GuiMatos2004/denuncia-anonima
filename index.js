const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const SENHA_ADMIN = "rh2025granja"; // senha do RH

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Receber denúncia
app.post("/denunciar", (req, res) => {
  const denuncia = req.body.denuncia;

  if (!denuncia) {
    return res.status(400).send("Erro: denúncia vazia.");
  }

  // Gerar data/hora de São Paulo
  const now = new Date();
  const options = {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };

  const dataHorario = new Intl.DateTimeFormat("pt-BR", options).format(now);

  const texto = `Denúncia: ${denuncia}\nData: ${dataHorario}\n---\n`;

  fs.appendFileSync("denuncias.txt", texto);

  res.send("Denúncia enviada com sucesso!");
});

// Tela de login do RH
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

// Validar senha e abrir painel
app.post("/admin", (req, res) => {
  const senha = req.body.senha;

  if (senha === SENHA_ADMIN) {
    res.redirect("/painel");
  } else {
    res.send("Senha incorreta!");
  }
});

// Painel do RH
app.get("/painel", (req, res) => {
  const filePath = path.join(__dirname, "denuncias.txt");
  let denuncias = "";

  if (fs.existsSync(filePath)) {
    denuncias = fs.readFileSync(filePath, "utf8");
  }

  res.send(`
    <h2>Painel do RH</h2>
    <pre>${denuncias}</pre>
    <form action="/limpar" method="POST">
      <button type="submit">Apagar Todas as Denúncias</button>
    </form>
  `);
});

// Rota para limpar denúncias
app.post("/limpar", (req, res) => {
  fs.writeFileSync("denuncias.txt", "");
  res.send("Denúncias apagadas!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));


