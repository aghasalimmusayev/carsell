import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; // as-istediyimiz ad ile islede bilek de
import { promisify } from "util"; // async function-u Promise-e cevirir

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) { }

    async signup(email: string, password: string) {
        const users = await this.userService.find(email)
        if (users.length) throw new BadRequestException('email is already exists')

        const salt = randomBytes(8).toString('hex')
        // salt yaradiriq. salt bcrypt-den daha guvenlidi
        // buffer is like array but for binary data
        // randomByte - generate a string of random bytes 10110010
        // for 1 byte we need 2 hex characters
        // 8 bytes will be 16 hex characters

        const hash = (await scrypt(password, salt, 32)) as Buffer
        // 32 - is the length of the generated key
        // scrypt function takes 3 arg (password, salt, ley of length)
        // Buffer is a global object in NodeJS that is used to handle data directly

        const result = salt + '.' + hash.toString('hex')
        // daha da tehlukesizlik ucun salt ve hash-i(Buffer-i string-e cevirib) noqte ile birlesdirdik

        const user = await this.userService.create(email, result)
        return user
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email)
        if (!user) throw new NotFoundException('User not found')

        const [salt, storedHash] = user.password.split('.')
        const hash = (await scrypt(password, salt, 32)) as Buffer

        if (storedHash !== hash.toString('hex')) throw new BadRequestException('Password is wrong')
        return user
    }
}