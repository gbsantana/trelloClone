const express = require('express');
const app = express();
require('/config/dbCOonfig');

app.use(express.json());

app.get('/', (request, response) => {
    return response.json({
        nome: "Heudmann Lima",
        profissao: "Engenheiro"
    });
});

app.listen(3333);