import type { H3Event } from 'h3';
import { sendErrorResp } from './response';

export const requireUser = (event: H3Event) => {
  const user = event.context.user;
  if (!user) {
    sendErrorResp(401, 'Unauthorized');
    return null;
  }
  return user;
};
