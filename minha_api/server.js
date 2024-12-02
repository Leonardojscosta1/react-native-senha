const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Importando o CORS

const app = express();
app.use(cors());  // Habilitando CORS
app.use(bodyParser.json());

const users = [
    { id: 1, username: 'leon', password: '123' },
];

app.get('/login', (req, res) => {
    const { username, password } = req.query;  
    console.log('Requisição recebida:', req.query);

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    if (user.password === password) {
        return res.status(200).json({ success: true, message: 'Logado', user });
    } else {
        return res.status(401).json({ success: false, message: 'Senha Errada' });
    }
});

// Alterando o IP para o correto
const PORT = 3000;
app.listen(PORT, () => console.log(`API rodando em http://192.168.1.236:${PORT}`));
