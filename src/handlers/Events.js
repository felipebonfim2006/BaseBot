const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const pastaEventsPath = path.join(__dirname, "../events");

    // Carrega os arquivos de eventos de cada categoria
    const pastasEventos = fs.readdirSync(pastaEventsPath);

    pastasEventos.forEach((pasta) => {
        const caminhoPasta = path.join(pastaEventsPath, pasta);

        if (fs.statSync(caminhoPasta).isDirectory()) {
            const arquivosEventos = fs
                .readdirSync(caminhoPasta)
                .filter((file) => file.endsWith(".js"));

            arquivosEventos.forEach((arquivo) => {
                const caminhoArquivo = path.join(caminhoPasta, arquivo);
                const evento = require(caminhoArquivo);

                // Registra o evento uma vez ou continuamente
                if (evento.once) {
                    client.once(evento.name, (...args) =>
                        evento.execute(...args, client),
                    );
                } else {
                    client.on(evento.name, (...args) =>
                        evento.execute(...args, client),
                    );
                }

                console.log(`[Evento Carregado] ${pasta} -> ${evento.name}`);
            });
        }
    });
};
