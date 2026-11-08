const mongoose = require("mongoose");
const { mongo_uri } = require("../configs/config.json");

async function connectDB() {
    try {
        await mongoose.connect(mongo_uri);
        console.log(
            "✅ Ligação à base de dados MongoDB estabelecida com sucesso!",
        );
    } catch (error) {
        console.error("❌ Erro ao ligar à base de dados:", error);
    }
}

module.exports = connectDB;
