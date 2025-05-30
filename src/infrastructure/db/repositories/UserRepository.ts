import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserModel } from "../models/UserModels";

export class UserRepository implements IUserRepository {
  async isEmailExists(email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ where: { email } });
      return !!user;
    } catch (error) {
      throw new Error("Error checking if email exists");
    }
  }

  async createPersonal(user: User): Promise<User> {
    try {
      const newUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      });

      return new User(
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.password,
        newUser.role
      );
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async updatePersonal(id: string, user: Partial<User>): Promise<User> {
    try {
      const [affectedRows] = await UserModel.update(
        {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        },
        { where: { id } }
      );

      if (affectedRows === 0) {
        throw new Error("User not found");
      }

      const updatedUser = await UserModel.findOne({ where: { id } });

      if (!updatedUser) {
        throw new Error("Failed to retrieve user after update");
      }

      return new User(
        updatedUser.id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.password,
        updatedUser.role
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error during update"
      );
    }
  }

  async deletePersonal(id: string): Promise<void> {
    try {
      const deleted = await UserModel.destroy({ where: { id } });
      if (deleted === 0) {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    }
  }

  async getPersonal(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ where: { id } });
      return user
        ? new User(user.id, user.name, user.email, user.password, user.role)
        : null;
    } catch (error) {
      throw new Error("Error fetching user by ID");
    }
  }

  async getAllPersonal(): Promise<User[]> {
    try {
      const users = await UserModel.findAll();
      return users.map(
        (user) =>
          new User(user.id, user.name, user.email, user.password, user.role)
      );
    } catch (error) {
      throw new Error("Error fetching all users");
    }
  }
}
