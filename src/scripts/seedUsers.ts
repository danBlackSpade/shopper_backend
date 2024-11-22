
import mongoose from "mongoose"
import User  from "../models/user.model"
import dotenv from 'dotenv'

dotenv.config()

// const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/shopper-rides'
//local
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopper-rides'

const seedUsers = async () => {


    // add data
  const users = [
    {
      id: 1,
      role: 'driver',
      name: 'Homer Simpson',
      description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
      car: 'Plymouth Valiant',
      rating: {
        value: 2,
        description: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.'
      },
      fee: 2.50,
      minMeters: 1000
    },
    {
      id: 2,
      role: 'driver',
      name: 'Dominic Toretto',
      description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
      car: 'Dodge Charger R/T 1970',
      rating: {
        value: 4,
        description: 'Que viagem incrível! O carro é um show à partee o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!'
      },
      fee: 5.00,
      minMeters: 5000
    },
    {
      id: 3,
      role: 'driver',
      name: 'James Bond',
      description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
      car: 'Aston Martin DB5 clássico',
      rating: {
        value: 5,
        description: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.'
      },
      fee: 10.00,
      minMeters: 10000
    },
    {
      id: 4,
      role: 'customer',
      name: 'Passageiro Tio Patinhas',

    },

  ]

  const connectWithRetry = async () => {
      try {
        await mongoose.connect(mongoUri)
        console.log('MongoDB connected')

      await User.deleteMany({})
      console.log('Users deleted')

      await User.insertMany(users)
      console.log('@@ Users created')

      await mongoose.disconnect()
      console.log('MongoDB disconnected')

    } catch (error) {
      console.error('MongoDB connection error:', error)
      // process.exit(1);
      setTimeout(connectWithRetry, 5000)
    }
  }

  await connectWithRetry()
}

seedUsers().catch((error) => {
  console.error('Error seeding users:', error)
})

