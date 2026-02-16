import { ValidationPipe } from "@nestjs/common"
import cookieSession from "cookie-session"


export const setupApp = (app: any) => {
    app.use(cookieSession({
        keys: ['asdfghj']
    }))
    app.useGlobalPipes( // Validation
        new ValidationPipe({
            whitelist: true
        })
    )

}