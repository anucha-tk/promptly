export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  };
});
