// server/utils/response.ts

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * มาตรฐาน Response แบบชั้นเดียว
 */
export const sendSuccessResp = <T>(data: T, message = 'Success') => {
  return <ApiResponse<T>>{
    success: true,
    message,
    data,
  };
};

/**
 * ใช้ร่วมกับ createError เพื่อให้ได้ format เดียวกันตอนเกิด Error
 */
export const sendErrorResp = (statusCode: number, message: string) => {
  throw createError({
    statusCode,
    statusMessage: message,
    data: {
      success: false,
      message,
      data: null,
    },
  });
};
