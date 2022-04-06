import { Logger } from '../helpers/Logger';
import { KnexHelper } from '../helpers/knex.helper';
import { CustomError } from '../helpers';
import { StatusCodes } from 'http-status-codes';
import { GetUserRequest, SaveUserRequest, UpdateUserRequest, User } from '../interfaces/user';

export async function addUser(request: SaveUserRequest): Promise<boolean> {
  const result = await KnexHelper.getUsers({ public_address: request.public_address });
  if (result.length !== 0) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'User already exists');
  }
  return await KnexHelper.insertUser(request);
}

export async function getUsers(request: GetUserRequest): Promise<User[]> {
  Logger.Info('Getting User...', request);
  const result = await KnexHelper.getUsers(request);
  if (result.length === 0) {
    throw new CustomError(StatusCodes.NOT_FOUND, 'No user found');
  }
  return result;
}

export async function updateUser(request: UpdateUserRequest): Promise<boolean> {
  Logger.Info('Running user update process', request);
  await getUsers({ public_address: request.public_address });
  const response = await KnexHelper.updateUser(request.public_address, { username: request.username });
  Logger.Info(response);
  return true;
}
