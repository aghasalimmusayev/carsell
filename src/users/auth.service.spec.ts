import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";


describe('AuthService', () => {
    let service: AuthService
    let fakeUserService: Partial<UsersService>

    beforeEach(async () => {
        fakeUserService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({
                id: 1, email, password
            } as User)
        }
        const module = await Test.createTestingModule({ // Fake Dependency Injection
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
                // burada deyirik ki UserService-i AuthService-e ver, amma o teleb edende fakeUserService-i ona otur, onunla islesin
            ]
        }).compile()
        service = module.get(AuthService) // AuthService-in kopyasinin yaradiriq
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined() // Service teyin olunubmu
    })

    it('Create a new User with salted and hashed password', async () => {
        const user = await service.signup('test@gmail.com', '123456')
        expect(user.password).not.toEqual('123456')

        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throw an error if User with this email already exist', async () => {
        fakeUserService.find = () => Promise.resolve([{ id: 1, email: 'test@gmail.com', password: '123456' } as User])
        await expect(service.signup('test@gmail.com', '123456')).rejects.toThrow(BadRequestException)
    })

    it('throw an error if User not found', async () => {
        await expect(service.signin('test@gmail.com', '123456')).rejects.toThrow(NotFoundException)
    })
})
