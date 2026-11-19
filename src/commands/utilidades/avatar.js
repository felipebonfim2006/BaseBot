import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    // Configuração do Slash Command (Estrutura enviada para a API do Discord)
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Mostra a foto de perfil de um usuário")
        .addUserOption((option) =>
            option
                .setName("usuario")
                .setDescription("O usuário que você quer ver o avatar")
                .setRequired(false),
        ),

    // Configurações do comando por prefixo (Nome principal, aliases e descrição)
    name: "avatar",
    aliases: ["av", "foto"],
    description: "Retorna a imagem de perfil do usuário ou do mencionado.",

    // Função executada quando o comando é acionado via Slash Command (/)
    async executeSlash(interaction) {
        // Pega o usuário mencionado na opção ou usa o próprio autor da interação caso não informe ninguém
        const usuario =
            interaction.options.getUser("usuario") || interaction.user;

        // Gera a URL do avatar em alta qualidade (tamanho 4096) com suporte a GIFs animados
        const avatarURL = usuario.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        // Cria o embed visual exibindo a imagem de perfil do usuário
        const avatarEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Avatar de ${usuario.username}`)
            .setURL(avatarURL)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setImage(avatarURL)
            .setTimestamp();

        // Responde à interação enviando o embed criado
        await interaction.reply({ embeds: [avatarEmbed] });
    },

    // Função executada quando o comando é acionado via Prefixo (ex: !avatar)
    async executePrefix(message) {
        // Pega o primeiro usuário mencionado na mensagem ou usa o próprio autor caso não mencione ninguém
        const usuario = message.mentions.users.first() || message.author;

        // Gera a URL do avatar em alta qualidade (tamanho 4096) com suporte a GIFs animados
        const avatarURL = usuario.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        // Cria o embed visual exibindo a imagem de perfil do usuário
        const avatarEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Avatar de ${usuario.username}`)
            .setURL(avatarURL)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setImage(avatarURL)
            .setTimestamp();

        // Envia o embed diretamente no canal de texto onde o comando foi digitado
        await message.channel.send({ embeds: [avatarEmbed] });
    },
};
