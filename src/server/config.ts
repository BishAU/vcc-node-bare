import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  facebookAccessToken: string;
  // Add other configuration variables as needed
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  facebookAccessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
};
