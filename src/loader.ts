import { TokenTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings} from "langchain/embeddings/openai";
import path from "node:path";
import { createClient } from "redis";

require('dotenv').config();

const loader = new TextLoader(path.resolve(__dirname, "../temp/curso-ads.txt"));

async function load() {
    const document = await loader.load();

    const splitter = new TokenTextSplitter({
        chunkOverlap: 0,
        chunkSize: 50,
        encodingName: 'cl100k_base'
    });

    const splitterDocuments = await splitter.splitDocuments(document);
    console.log(splitterDocuments);

    const redis = createClient({
        url: 'redis://127.0.0.1:6379'
    });

    await redis.connect();

    await RedisVectorStore.fromDocuments(
        splitterDocuments,
        new OpenAIEmbeddings({  openAIApiKey: process.env.OPENAI_API_KEY }),
        {
            indexName: 'curso-ads',
            redisClient: redis,
            keyPrefix: 'curso:'
        }
    )

    await redis.disconnect();
}

load();