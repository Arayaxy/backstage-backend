import 'dotenv/config';

const requiredVariables = [
  'API_URL_BASE',
];
const missingVariables = requiredVariables.filter(variable => !process.env[variable]);

if (missingVariables.length) {
  console.log(`❌ Missing required environment variables: ${missingVariables.join(', ')}`);
  process.exit(1);
}

export const env = {
  mode: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiUrl: process.env.API_URL_BASE,
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  jwtSecret: process.env.JWT_SECRET,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudApiKey: process.env.CLOUDINARY_API_KEY,
  cloudApiSecret: process.env.CLOUDINARY_API_SECRET,
};
