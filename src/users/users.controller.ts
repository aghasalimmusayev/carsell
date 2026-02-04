import { Body, Get, Controller, Param, Post, Query, Delete, Patch, Session, UseInterceptors, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
//? Interceptor-u user.module-da global etdiyimiz ucun her controller-de bunu yazmaga ehtiyac yoxdu
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @UseGuards(AuthGuard)
    @Get('/me')
    me(@CurrentUser() user: User) {
        return user
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async signInUser(@Body() body: CreateUserDto, @Session() session: any) { // Yeni DTO yaratmaq lazimdi
        const user = await this.authService.signin(body.email, body.password) //! test-den kecmedi
        session.userId = user.id
        return user
    }

    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
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
