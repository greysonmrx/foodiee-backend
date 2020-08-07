export default {
  jwt: {
    secret: process.env.AUTH_SECRET || 'default',
    expiresIn: process.env.AUTH_EXPIRES_IN || '7d',
  },
};
