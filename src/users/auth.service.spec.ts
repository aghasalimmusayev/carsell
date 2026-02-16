import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = []
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter((user) => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password
                } as User;

                users.push(user);
                return Promise.resolve(user);
            }
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        //  const service = module.get(AuthService);
        service = module.get(AuthService)
    });

    it('can creaete an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('Creates a new user with salted and hashed password', async () => {
        const user = await service.signup('test@example.com', '123456');
        expect(user.password).not.toEqual('123456')

        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs upp with email that is in use', async () => {
        await service.signup('test@example.com', '123456');
        await expect(service.signup('test@example.com', '123456'))
            .rejects.toThrow(BadRequestException);
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('test@test.com', '123')).rejects.toThrow(NotFoundException)
    });

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ id: 1, email: 'test@example.com', password: 'password' } as User]);
        await expect(service.signin('test@example.com', 'wrongpassword')).rejects.toThrow(BadRequestException)
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup('test@test.com', '123456');
        const user = await service.signin('test@test.com', '123456');
        expect(user).toBeDefined()
    })
})