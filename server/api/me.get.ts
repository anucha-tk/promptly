import { sendSuccessResp } from '../utils/response';

export default defineEventHandler(async (event) => {
  const user = requireUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  return sendSuccessResp(
    {
      user_id: user.uid,
      email: user.email,
    },
    'User fetched successfully'
  );
});
