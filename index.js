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
    const { denuncia } = req.body;

    const texto = `Denúncia: ${denuncia}\nData: ${new Date().toLocaleString()}\n\n`;

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

    // Ler o arquivo de denúncias
    fs.readFile('denuncias.txt', 'utf8', (err, data) => {
        if (err) {
            return res.send("Nenhuma denúncia encontrada.");
        }

        // Transformar em HTML mais organizado
        const denunciasFormatadas = data
            .split('\n\n')
            .filter(x => x.trim() !== "")
            .map((d, i) => `<p><b>Denúncia ${i + 1}:</b><br>${d.replace(/\n/g, "<br>")}</p>`)
            .join('<hr>');

        res.send(`
            <h2>Denúncias Recebidas</h2>
            ${denunciasFormatadas}
            <br><br>
            <a href="/admin">Voltar</a>
        `);
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});

