const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Permite ler dados enviados pelo formulário
app.use(express.urlencoded({ extended: true }));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para receber a denúncia
app.post('/enviar', (req, res) => {
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
fs.appendFileSync('denuncias.txt', texto);


    fs.appendFileSync('denuncias.txt', texto);

    res.send('Denúncia enviada com sucesso! Obrigado.');
});

const port = process.env.PORT || 3000;

// Página de login do RH
app.get('/admin', (req, res) => {
    res.send(`
        <h2>Painel do RH</h2>
        <form method="POST" action="/admin">
            <input type="password" name="senha" placeholder="Digite a senha" required />
            <button type="submit">Entrar</button>
        </form>
    `);
});

// Verificar senha
app.post('/admin', (req, res) => {
    const { senha } = req.body;

    if (senha !== "rh2025granja") {
        return res.send("Senha incorreta!");
    }

    fs.readFile('denuncias.txt', 'utf8', (err, data) => {
        if (err || data.trim() === "") {
            return res.send(`
                <h2>Denúncias Recebidas</h2>
                <p>Nenhuma denúncia encontrada.</p>
                <form action="/limpar" method="POST">
                    <button type="submit">🗑 Limpar todas as denúncias</button>
                </form>
                <br><br>
                <a href="/admin">Voltar</a>
            `);
        }

        const denunciasFormatadas = data
            .split('\n\n')
            .filter(x => x.trim() !== "")
            .map((d, i) => `<p><b>Denúncia ${i + 1}:</b><br>${d.replace(/\n/g, "<br>")}</p>`)
            .join('<hr>');

        res.send(`
            <h2>Denúncias Recebidas</h2>
            ${denunciasFormatadas}
            <br><br>

            <form action="/limpar" method="POST">
                <button type="submit">🗑 Limpar todas as denúncias</button>
            </form>

            <br><br>
            <a href="/admin">Voltar</a>
        `);
    });
});

// Rota para limpar todas as denúncias
app.post('/limpar', (req, res) => {
    // Apagar o conteúdo do arquivo
    fs.writeFile('denuncias.txt', '', (err) => {
        if (err) {
            return res.send("Erro ao limpar denúncias.");
        }

        res.send(`
            <h2>Denúncias apagadas com sucesso!</h2>
            <a href="/admin">Voltar ao painel</a>
        `);
    });
});



app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});

