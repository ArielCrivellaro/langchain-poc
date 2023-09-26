import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate} from 'langchain/prompts';
import { RetrievalQAChain } from 'langchain/chains'
import { redis, redisVectorStore } from './redis-store';

// chain para salvar conversas anteriores: ConversationalRetrievalChain

const openAiChat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.3,
});

const prompt = new PromptTemplate({
    template: `
    Voce responde duvidas sobre o curso de ADS da Anhanguera.
    Use o conteudo das transcrições da ementa do curso abaixo para responder a pergunta do usuário
    utilize apenas os dados das transcrições para responder a pergunta do usuário. 
    Transcrições:
    {context}

    Pergunta: {question}
    `.trim(),
    inputVariables: ['context', 'question'],
})

const chain = RetrievalQAChain.fromLLM(openAiChat, redisVectorStore.asRetriever(2), {
    prompt,
    // returnSourceDocuments: true,
    // verbose: true,
});

async function main() {
  await redis.connect();  

  const response = await chain.call({
    query: 'Qual a parte tecnica é usada no curso?',
  })

  console.log(response);

  await redis.disconnect();
}

main();