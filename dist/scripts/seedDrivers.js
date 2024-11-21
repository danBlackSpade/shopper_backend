"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const driver_model_1 = __importDefault(require("../models/driver.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopper-rides';
const seedDrivers = async () => {
    // add data
    const drivers = [
        {
            id: 1,
            name: 'Homer Simpson',
            description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
            car: 'Plymouth Valiant',
            rating: {
                value: 2,
                description: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.'
            },
            fee: 2.50,
            minKm: 1
        },
        {
            id: 2,
            name: 'Dominic Toretto',
            description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
            car: 'Dodge Charger R/T 1970',
            rating: {
                value: 4,
                description: 'Que viagem incrível! O carro é um show à partee o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!'
            },
            fee: 5.00,
            minKm: 5
        },
        {
            id: 3,
            name: 'James Bond',
            description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
            car: 'Aston Martin DB5 clássico',
            rating: {
                value: 5,
                description: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.'
            },
            fee: 10.00,
            minKm: 10
        },
    ];
    const connectWithRetry = async () => {
        try {
            await mongoose_1.default.connect(mongoUri);
            console.log('MongoDB connected');
            await driver_model_1.default.deleteMany({});
            console.log('Drivers deleted');
            await driver_model_1.default.insertMany(drivers);
            console.log('Drivers created');
            await mongoose_1.default.disconnect();
            console.log('MongoDB disconnected');
        }
        catch (error) {
            console.error('MongoDB connection error:', error);
            // process.exit(1);
            setTimeout(connectWithRetry, 5000);
        }
    };
    await connectWithRetry();
};
seedDrivers().catch((error) => {
    console.error('Error seeding drivers:', error);
});
