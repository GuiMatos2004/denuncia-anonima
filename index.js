const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

  const texto = `Denúncia: ${denuncia}\nData: ${dataHorario}\n\n`;

  // Salvar no arquivo
  fs.appendFileSync("denuncias.txt", texto);

  res.send("Denúncia enviada com sucesso! Obrigado.");
});

// Servidor local
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
