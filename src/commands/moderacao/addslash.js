const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    REST,
    Routes,
} = require("discord.js");
const Guild = require("../../database/models/Guild");
const { token } = require("../../configs/config.json");

module.exports = {
    // --- SLASH COMMAND ---
    data: new SlashCommandBuilder()
        .setName("addslash")
        .setDescription("Ativa e regista os slash commands neste servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // --- COMANDO POR PREFIXO ---
    name: "addslash",
    aliases: ["registerslash", "ativarslash"],
    description: "Ativa e regista os slash commands do bot neste servidor.",
    userPermissions: [PermissionFlagsBits.Administrator],

    // FUNÇÃO AUXILIAR: Envia os comandos para a API do Discord
    async registerCommands(guildId, client) {
        // Inicializa a ligação REST usando o token do config.json
        const rest = new REST({ version: "10" }).setToken(token);

        // Transforma a lista de Slash Commands num formato JSON
        const commandsData = client.slashCommands.map((cmd) =>
            cmd.data.toJSON(),
        );

        // Faz o pedido PUT para registar os comandos APENAS neste servidor
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guildId),
            { body: commandsData },
        );
    },

    async executeSlash(interaction, client) {
        await interaction.deferReply();

        try {
            await this.registerCommands(interaction.guild.id, client);

            // Atualiza na base de dados
            await Guild.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { slashCommandsAtivos: true },
                { upsert: true },
            );

            await interaction.editReply(
                "✅ Todos os Slash Commands foram sincronizados e atualizados neste servidor!",
            );
        } catch (error) {
            console.error("Erro ao sincronizar slash commands:", error);
            await interaction.editReply(
                "❌ Ocorreu um erro ao atualizar os slash commands.",
            );
        }
    },

    async executePrefix(message, args, client) {
        const msg = await message.reply(
            "⏳ A registar os Slash Commands neste servidor. Por favor, aguarde...",
        );

        try {
            await this.registerCommands(message.guild.id, client);

            // Atualiza na base de dados
            await Guild.findOneAndUpdate(
                { guildId: message.guild.id },
                { slashCommandsAtivos: true },
                { upsert: true },
            );

            await msg.edit(
                "✅ Os Slash Commands foram ativados com sucesso neste servidor!\n*(Pode demorar alguns segundos até que apareçam na lista do Discord. Se não aparecerem logo, reinicie o seu Discord).*",
            );
        } catch (error) {
            console.error(
                "Erro ao registar slash commands por prefixo:",
                error,
            );
            await msg.edit(
                "❌ Ocorreu um erro ao falar com a API do Discord. Verifica a consola do teu bot.",
            );
        }
    },
};
