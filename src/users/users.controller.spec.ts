import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'email@email.com', password: 'asd' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'asd' } as User
        ])
      },
      findOrFail: (id: number) => {
        if (id === 1) {
          return Promise.resolve({ id, email: 'email@email.com', password: 'asd' } as User)
        }
        return Promise.reject('User not found');
      }
      // remove: () => {},
      // update: () => {},
    }

    fakeAuthService = {
      // signup:() => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('email@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('email@email.com');
  });

  it('findUser returns a single user with the given id ', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user?.id).toEqual(1)
  });

  it('findUser throws an error if user with given id is not found', async () => {
    await expect(controller.findUser('999')).rejects.toBeDefined();
  })

  it('signin updates session object and returns user', async () => {
    const session = { userId: -48 };
    const user = await controller.signInUser(
      { email: 'email@email.com', password: 'asd' },
      session
    )
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1)
  })
});