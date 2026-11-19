import {
    Events,
    REST,
    Routes,
    ActivityType,
    PresenceUpdateStatus,
} from "discord.js";
import "dotenv/config";

// Auxiliar simples para aguardar um tempo antes de aplicar a presença
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Aguarda brevemente para garantir que o Gateway concluiu a inicialização da sessão
        await delay(1500);

        // Define a atividade do bot
        try {
            client.user.setPresence({
                activities: [
                    {
                        name: `${client.user.username} | /help`,
                        type: ActivityType.Watching,
                    },
                ],
                status: PresenceUpdateStatus.Idle,
            });
        } catch (error) {
            console.error("Erro ao definir a atividade do bot:", error);
        }
        // Cria uma instância do REST para registrar os comandos
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        // Array para armazenar os comandos de barra a serem registrados
        const commandsJson = [];

        if (client.slashCommands) {
            // Adiciona os comandos de barra ao array
            client.slashCommands.forEach((command) => {
                commandsJson.push(command.data.toJSON());
            });
        }

        // ESCOLHA APENAS UMA DAS OPÇÕES ABAIXO PARA REGISTRAR OS COMANDOS DE BARRA, NÃO AMBAS AO MESMO TEMPO

        // [OPÇÃO 1 - Registo por presença do bot] Registra os comandos com prioridade para cada servidor que o bot está presente, substituindo os já registrados para evitar duplicidade
        for (const guild of client.guilds.cache.values()) {
            try {
                // Exibe no console o início do registro de slash commands para o servidor atual
                console.log(
                    `[DEPLOY SLASH COMMANDS] Registrando comandos de barra para o servidor: ${guild.name} (${guild.id})`,
                );

                // Zera os comandos de barra do servidor antes de registrar os novos, garantindo que não haja duplicidade
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id),
                    { body: [] },
                );
                // Substitui os comandos registrados no servidor pelos atuais (evita duplicidade e mantém o estado sincronizado)
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id),
                    {
                        body: commandsJson,
                    },
                );
                // Confirma no console que os comandos foram registrados no servidor
                console.log(
                    `[DEPLOY SLASH COMMANDS] Comandos de barra registrados com sucesso para o servidor: ${guild.name} (${guild.id})`,
                );
            } catch (err) {
                // Captura falhas em um servidor específico sem interromper o loop nos demais
                console.error(
                    `[ERRO DE DEPLOY SLASH COMMANDS] Erro ao registrar os comandos de barra para o servidor: ${guild.name} (${guild.id})`,
                    err,
                );
            }
        }
        // [OPÇÃO 2 - Registo global] Registra os comandos globalmente (isso pode levar até 1 hora para refletir em todos os servidores)
        /*try {
            console.log("[DEPLOY SLASH COMMANDS] Iniciando o registro dos comandos de barra...");
            // Zera os comandos globais antes de registrar os novos, garantindo que não haja duplicidade
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: [],
            });
            // Substitui os comandos globais pelos atuais (evita duplicidade e mantém o estado sincronizado)
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: commandsJson,
            });
            console.log("[DEPLOY SLASH COMMANDS] Comandos de barra registrados com sucesso!");
        } catch (err
        ) {
            console.error("[ERRO DE DEPLOY SLASH COMMANDS] Erro ao registrar os comandos de barra:", err);
        }
            */
    },
};
