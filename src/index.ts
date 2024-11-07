import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import axios from 'axios';
import cron from 'node-cron';

// Inicialização do Express
const app = express();
const PORT = 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/redditData')
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));

// Definição do Schema e Model para os Posts
interface DataItem {
  id: string;
  title: string;
  author_fullname: string;
  created_utc: number;
  created_date: string;
  ups: number;
  num_comments: number;
}

const postSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },  // ID único
  title: { type: String, required: true },
  author_fullname: { type: String, required: true },
  created_utc: { type: Number, required: true, index: true },
  created_date: { type: String, required: true },
  ups: { type: Number, required: true, index: true },
  num_comments: { type: Number, required: true, index: true }
});

const Post = mongoose.model<DataItem>('Post', postSchema);

// Função para buscar os dados do Reddit
async function fetchData(): Promise<DataItem[]> {
  try {
    const url = 'https://www.reddit.com/r/artificial/hot.json';
    const response = await axios.get(url);
    const children = response.data.data.children;

    return children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      author_fullname: child.data.author_fullname,
      created_utc: child.data.created_utc,
      created_date: new Date(child.data.created_utc * 1000).toLocaleString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ups: child.data.ups,
      num_comments: child.data.num_comments
    }));
  } catch (error) {
    console.error('Erro ao buscar dados do Reddit:', error);
    return [];
  }
}

// Função para salvar os dados no MongoDB usando bulkWrite
async function saveData(data: DataItem[]): Promise<void> {
  if (data.length === 0) {
    console.log('Nenhum dado para salvar.');
    return;
  }

  try {
    const bulkOps = data.map(item => ({
      updateOne: {
        filter: { id: item.id }, // Critério de busca: ID do post
        update: { $set: item },  // Atualizar ou inserir os dados
        upsert: true             // Criar um novo documento se ele não existir
      }
    }));

    await Post.bulkWrite(bulkOps); // Executa todas as operações em lote
    console.log('Todos os dados foram salvos no MongoDB com sucesso');
  } catch (error) {
    // Verificação se o erro é uma instância de Error
    if (error instanceof Error) {
      console.error('Erro ao salvar os dados no MongoDB:', error.message);
    } else {
      console.error('Erro desconhecido ao salvar os dados no MongoDB', error);
    }
  }
}

// Função que busca e salva os dados
async function fetchAndSaveData(): Promise<void> {
  try {
    const data = await fetchData();
    await saveData(data);
    console.log('Dados buscados e salvos com sucesso');
  } catch (error) {
    console.error('Erro ao buscar e salvar os dados:', error);
  }
}

// Função para gerar conteúdo HTML usando Tailwind CSS
async function generateHtmlContent(data: DataItem[]): Promise<string> {
  let postsHtml = data.map(post => `
    <li class="mb-6">
      <div class="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105">
        <div class="mb-4">
          <h2 class="text-xl font-semibold">${post.title}</h2>
          <p class="text-sm text-gray-600">Autor: ${post.author_fullname}</p>
          <p class="text-sm text-gray-600">Publicado em: ${post.created_date}</p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-sm font-medium text-blue-600">Upvotes: <strong>${post.ups}</strong></p>
          <p class="text-sm font-medium text-green-600">Comentários: <strong>${post.num_comments}</strong></p>
        </div>
      </div>
    </li>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Posts Quentes do Reddit</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 p-10">
      <h1 class="text-4xl font-bold mb-8">Posts Quentes do r/artificial</h1>
      <p class="text-lg mb-4">Número de posts: ${data.length}</p>
      <button id="saveButton" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">Salvar Dados no MongoDB</button>
      <p id="saveStatus" class="mt-4 text-red-500"></p>
      <ul class="mt-6 space-y-4">
        ${postsHtml}
      </ul>
      <script>
        document.getElementById('saveButton').addEventListener('click', async () => {
          const saveStatus = document.getElementById('saveStatus');
          saveStatus.textContent = 'Salvando...';
          try {
            const response = await fetch('/save', { method: 'POST' });
            if (response.ok) {
              saveStatus.textContent = 'Dados salvos com sucesso!';
              saveStatus.classList.remove('text-red-500');
              saveStatus.classList.add('text-green-500');
              console.log('Dados salvos com sucesso no MongoDB');
            } else {
              saveStatus.textContent = 'Erro ao salvar os dados.';
              console.error('Erro no servidor ao tentar salvar os dados.');
            }
          } catch (error) {
            saveStatus.textContent = 'Erro ao salvar os dados.';
            console.error('Erro ao salvar os dados no MongoDB:', error);
          }
        });
      </script>
    </body>
    </html>
  `;
}

// Rota para salvar os dados no MongoDB
app.post('/save', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await fetchData();
    await saveData(data);
    res.status(200).json({ message: 'Dados salvos com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(500).json({ message: 'Erro ao salvar os dados' });
  }
});

// Rota principal para exibir os posts
app.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Buscando dados...');
    const data = await fetchData();
    console.log(`Foram buscados ${data.length} itens`);
    const htmlContent = await generateHtmlContent(data);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
    console.log('Resposta enviada com sucesso');
  } catch (error) {
    console.error('Erro ao gerar HTML:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Tarefa agendada com cron para rodar diariamente à meia-noite
cron.schedule('0 0 * * *', async () => {
  console.log('Executando tarefa diária de busca e salvamento de dados');
  try {
    await fetchAndSaveData();
    console.log('Tarefa diária concluída com sucesso');
  } catch (error) {
    console.error('Erro na tarefa diária:', error);
  }
});

console.log('Tarefa cron agendada para rodar diariamente à meia-noite');

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});