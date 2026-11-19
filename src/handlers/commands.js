import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Collection } from "discord.js";

// Adaptando o __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
    // Inicializa as coleções e o mapa no cliente
    client.slashCommands = new Collection();
    client.prefixCommands = new Collection();
    client.commandCategories = new Map();

    // Monta o caminho completo até a pasta 'commands'
    const pastaComandosPath = path.join(__dirname, "../commands");

    // Verifica se a pasta 'commands' realmente existe; se não existir, encerra a função
    if (!fs.existsSync(pastaComandosPath)) return;

    // Lê e retorna uma lista com os nomes de todos os itens dentro da pasta 'commands'
    const categorias = fs.readdirSync(pastaComandosPath);

    // Percorre cada item encontrado dentro da pasta 'commands'
    for (const categoria of categorias) {
        // Monta o caminho completo até a subpasta atual
        const caminhoCategoria = path.join(pastaComandosPath, categoria);

        // Verifica se o item atual é realmente uma pasta (e não um arquivo solto)
        if (fs.statSync(caminhoCategoria).isDirectory()) {
            // Lê os arquivos da subpasta e filtra apenas os que terminam com '.js'
            const arquivos = fs
                .readdirSync(caminhoCategoria)
                .filter((file) => file.endsWith(".js"));

            // Cria a lista da categoria no client se ela ainda não existir
            if (!client.commandCategories.has(categoria)) {
                client.commandCategories.set(categoria, []);
            }

            // Percorre cada arquivo '.js' encontrado
            for (const arquivo of arquivos) {
                // Monta o caminho completo até o arquivo do comando
                const caminhoArquivo = path.join(caminhoCategoria, arquivo);

                // Importa dinamicamente o arquivo
                const comandoModule = await import(
                    pathToFileURL(caminhoArquivo).href
                );

                // Captura o export default do arquivo de comando
                const comando = comandoModule.default ?? comandoModule;

                // Define a categoria no objeto do comando
                comando.category = categoria;

                // Registra comandos do tipo Slash
                if (comando.data && comando.executeSlash) {
                    client.slashCommands.set(comando.data.name, comando);
                }

                // Registra comandos do tipo Prefix e seus aliases
                if (comando.name && comando.executePrefix) {
                    client.prefixCommands.set(comando.name, comando);

                    if (comando.aliases && Array.isArray(comando.aliases)) {
                        comando.aliases.forEach((alias) => {
                            client.prefixCommands.set(alias, comando);
                        });
                    }
                }

                // Adiciona o comando à categoria correspondente no Map
                client.commandCategories.get(categoria).push(comando);

                console.log(`[Comando Carregado] ${arquivo} (${categoria})`);
            }
        }
    }
};
