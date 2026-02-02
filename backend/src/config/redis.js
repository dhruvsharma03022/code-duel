import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

// Connect to Redis
await redisClient.connect();

// Helper functions
export const setWithExpiry = async (key, value, expirySeconds) => {
  await redisClient.setEx(key, expirySeconds, JSON.stringify(value));
};

export const get = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const del = async (key) => {
  await redisClient.del(key);
};

export const exists = async (key) => {
  return await redisClient.exists(key);
};

export default redisClient;
