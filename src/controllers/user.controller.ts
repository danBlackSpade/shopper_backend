import { Request, Response, NextFunction } from 'express'
import User, { IUser } from '../models/user.model';
import { getNextSequence } from '../utils/common'


class UserController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email } = req.body;
      const nextId = await getNextSequence('users');

      if (!name || !email ) {
        return res.status(400).json({
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
          error_code: 'INVALID_DATA'
        });
      }

      const user = new User({
        id: nextId,
        name,
        email,
        role: 'customer'
      });

      await user.save();

      const u = await User.findOne({ id: nextId });

      return res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        userCreated: user,
        user: u
      });
    } catch (error) {
      return res.status(500).json({
        error_description: 'Erro ao criar usuário ' + error,
        error_code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
        error_description: 'Erro ao buscar usuários',
        error_code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  static async getDrivers(req: Request, res: Response): Promise<Response> {
    try {
      const drivers = await User.find({ role: 'driver' });
      return res.status(200).json(drivers);
    } catch (error) {
      return res.status(500).json({
        error_description: 'Erro ao buscar motoristas',
        error_code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }


}

export default UserController;