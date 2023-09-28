import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings} from "langchain/embeddings/openai";
import { createClient } from "redis";

require('dotenv').config();

export const redis = createClient({
    url: 'redis://127.0.0.1:6379'
});

export const redisVectorStore =  new RedisVectorStore(
    new OpenAIEmbeddings({  openAIApiKey: process.env.OPENAI_API_KEY }),
    {
        indexName: 'curso-ads',
        redisClient: redis,
        keyPrefix: 'curso:'
    }
)



