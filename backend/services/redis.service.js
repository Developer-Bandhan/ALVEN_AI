// import Redis from 'ioredis';

// const redisClient = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     password: process.env.REDIS_PASSWORD
// });

// redisClient.on('connect', () => {
//     console.log('Redis Connected');
// });

// export default redisClient;

// import Redis from 'ioredis';

// const redisClient = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     password: process.env.REDIS_PASSWORD,
//     connectTimeout: 10000, // Increased timeout for stability
//     retryStrategy: (times) => Math.min(times * 50, 2000),
// });

// redisClient.on('connect', () => console.log('✅ Redis Connected'));
// redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

// export default redisClient;

