import { Body, Get, Controller, Param, Post, Query, Delete, Patch, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color
    }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body.email, body.password)
    }

    @Post('/signin')
    async signInUser(@Body() body: CreateUserDto) { // Yeni DTO yaratmaq lazimdi
        return this.authService.signin(body.email, body.password) //! test-den kecmedi
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
        console.log('Handler is running')
        return this.userService.findOne(parseInt(id))
    }

    @Get('/')
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body)
    }
}
