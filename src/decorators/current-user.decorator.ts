import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        return request.currentUser
        // Decorator request-dən məlumat götürüb, onu controller method-un parametri kimi verir.
    }
)

