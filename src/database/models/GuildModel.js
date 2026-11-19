import { Schema, model } from "mongoose";
import "dotenv/config";

// Define a estrutura dos dados salvos para cada servidor no MongoDB
const guildSchema = new Schema({
    guildID: { type: String, required: true, unique: true },
    prefix: { type: String, default: process.env.PREFIX || "!" }, // Define o prefixo padrão por segurança
    slashCommandsActive: { type: Boolean, default: false },
});

// Exporta o model no padrão ESM para ser usado nos comandos e eventos
export default model("GuildModel", guildSchema);