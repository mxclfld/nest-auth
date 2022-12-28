import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import encodePassword from 'src/utils/encodePassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = encodePassword(createUserDto.password);
    const createdUser = await this.userModel.create({
      ...createUserDto,
      password,
    });
    return createdUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto?.password) {
      updateUserDto.password = encodePassword(updateUserDto.password);
    }

    const existingUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    if (!existingUser) throw new NotFoundException(`User #${id} not found!`);
    return existingUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) throw new NotFoundException(`User #${id} not found!`);
    return deletedUser;
  }

  async findAll(): Promise<User[] | undefined> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | undefined> {
    const existingUser = this.userModel.findOne({ _id: id }).exec();
    if (!existingUser) throw new NotFoundException(`User #${id} not found!`);
    return existingUser;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const existingUser = this.userModel.findOne({ username }).exec();
    if (!existingUser)
      throw new NotFoundException(`User ${username} not found!`);
    return existingUser;
  }
}
