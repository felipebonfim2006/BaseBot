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
        .setName("removeslash")
        .setDescription("Remove todos os slash commands do bot neste servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // --- COMANDO POR PREFIXO ---
    name: "removeslash",
    aliases: ["delslash", "removercomandos"],
    description: "Remove todos os slash commands do bot neste servidor.",
    userPermissions: [PermissionFlagsBits.Administrator],

    // FUNÇÃO AUXILIAR: Envia um array vazio para a API do Discord para apagar os comandos
    async deleteCommands(guildId, clientId) {
        // Inicializa a ligação REST usando o token do config.json
        const rest = new REST({ version: "10" }).setToken(token);

        // Enviar { body: [] } substitui a lista atual por uma lista vazia
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: [],
        });
    },

    async executeSlash(interaction, client) {
        await interaction.deferReply();

        try {
            await this.deleteCommands(interaction.guild.id, client.user.id);

            // Atualiza a base de dados para desativar a sincronização automática
            await Guild.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { slashCommandsAtivos: false },
                { upsert: true },
            );

            await interaction.editReply(
                "✅ Todos os Slash Commands foram removidos deste servidor! (Esta mensagem e o comando irão desaparecer do seu menu em breve).",
            );
        } catch (error) {
            console.error("Erro ao remover slash commands:", error);
            await interaction.editReply(
                "❌ Ocorreu um erro ao remover os slash commands.",
            );
        }
    },

    async executePrefix(message, args, client) {
        const msg = await message.reply(
            "⏳ A remover os Slash Commands deste servidor. Por favor, aguarde...",
        );

        try {
            await this.deleteCommands(message.guild.id, client.user.id);

            // Atualiza a base de dados
            await Guild.findOneAndUpdate(
                { guildId: message.guild.id },
                { slashCommandsAtivos: false },
                { upsert: true },
            );

            await msg.edit(
                "✅ Os Slash Commands foram removidos com sucesso deste servidor!\n*(Pode demorar alguns segundos até que desapareçam da lista do Discord. Se não desaparecerem logo, reinicie a sua aplicação do Discord).*",
            );
        } catch (error) {
            console.error("Erro ao remover slash commands por prefixo:", error);
            await msg.edit(
                "❌ Ocorreu um erro ao falar com a API do Discord. Verifica a consola do teu bot.",
            );
        }
    },
};
