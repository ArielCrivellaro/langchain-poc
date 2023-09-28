import { redis, redisVectorStore } from './redis-store'

async function search() {
    await redis.connect();

    const response = await redisVectorStore.similaritySearchWithScore(
      'Quais os fundamentos?',
      5  
    )

    console.log(response);

    await redis.disconnect();
}

search();