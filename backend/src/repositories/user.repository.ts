import { User, IUserDocument } from "../models/User";

export class UserRepository {
  async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
    return User.create(data);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email }).select("+password");
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async findAll(): Promise<IUserDocument[]> {
    return User.find();
  }

  async updateById(id: string, data: Partial<IUserDocument>): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string): Promise<IUserDocument | null> {
    return User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
