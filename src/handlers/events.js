import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Adaptando o __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
    // Monta o caminho completo até a pasta 'events'
    const pastaEventsPath = path.join(__dirname, "../events");

    // Verifica se a pasta 'events' realmente existe; se não existir, encerra a função
    if (!fs.existsSync(pastaEventsPath)) return;

    // Lê e retorna uma lista com os nomes de todos os itens dentro da pasta 'events'
    const pastasEventos = fs.readdirSync(pastaEventsPath);

    // Percorre cada item encontrado dentro da pasta 'events'
    for (const pasta of pastasEventos) {
        // Monta o caminho completo até a subpasta atual
        const caminhoPasta = path.join(pastaEventsPath, pasta);

        // Verifica se o item atual é realmente uma pasta (e não um arquivo solto)
        if (fs.statSync(caminhoPasta).isDirectory()) {
            // Lê os arquivos da subpasta e filtra apenas os que terminam com '.js'
            const arquivosEventos = fs
                .readdirSync(caminhoPasta)
                .filter((file) => file.endsWith(".js"));

            // Percorre cada arquivo '.js' encontrado
            for (const arquivo of arquivosEventos) {
                // Monta o caminho completo até o arquivo do evento
                const caminhoArquivo = path.join(caminhoPasta, arquivo);

                // Importa dinamicamente o arquivo
                const eventoModule = await import(
                    pathToFileURL(caminhoArquivo).href
                );

                // Captura o export default do arquivo de evento
                const evento = eventoModule.default ?? eventoModule;

                // Verifica se o evento deve ser executado apenas uma única vez
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
            }
        }
    }
};
