import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// ! EDCORADOR QUE DEVUELVE LOS RAW HEADERS DE LA REQUEST
export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest()['rawHeaders'];
  },
);
