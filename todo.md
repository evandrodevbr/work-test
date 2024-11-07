# To-Do e Lista de Restrições para o Desafio Back-End - Arrow Digital

## To-Do (O que devo fazer):

1. **Tecnologias obrigatórias**:
   - Usar **Node.js** como a linguagem principal.
   - Implementar o código em **TypeScript**.
   - Utilizar **Express** (ou outra biblioteca de roteamento similar) para criar os endpoints REST.
   - Configurar e interagir com o banco de dados **MongoDB**.
   - Utilizar **Mongoose** para modelagem dos dados.

2. **Consulta diária à API do Reddit**:
   - Criar uma tarefa agendada para rodar **uma vez por dia** em um horário específico. Use bibliotecas como `node-cron` ou `agenda` para tal.
   - A tarefa deve consultar a API do Reddit ([endpoint HOT do subreddit artificial](https://api.reddit.com/r/artificial/hot)).

3. **Salvar dados no MongoDB**:
   - Salvar no banco de dados as seguintes informações das postagens:
     - Título da postagem.
     - Nome do autor.
     - Timestamp da criação da postagem.
     - Número de **ups**.
     - Número de **comentários**.

4. **Criar dois endpoints REST**:
   - O **primeiro endpoint** deve receber dois parâmetros de data (`data de início` e `data final`) e retornar todas as postagens desse período, ordenadas das mais novas para as mais velhas.
     - Exemplo de input:
       - Data de início: `2024-09-01T00:00:00.000Z`
       - Data de fim: `2024-09-31T00:00:00.000Z`
   - O **segundo endpoint** deve receber três parâmetros (`data de início`, `data final` e `ordem`), e retornar as postagens desse período, ordenadas por **ups** ou **quantidade de comentários** em ordem decrescente.
     - Exemplo de input:
       - Data de início: `2024-09-01T00:00:00.000Z`
       - Data de fim: `2024-09-31T00:00:00.000`
       - Ordem: `ups` ou `comments`.

5. **Documentação**:
   - Incluir um arquivo `README.md` com instruções claras sobre como executar o projeto.
   - Seguir o padrão de commits conforme a especificação de [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/).

6. **Boas práticas e segurança**:
   - Seguir as melhores práticas de código, como:
     - Tratamento de erros e exceções.
     - Evitar falhas de segurança.
     - Garantir uma arquitetura bem-definida e legível.
     - Reduzir a quantidade de bugs.

## Pontos extras (O que pode gerar mais pontos):
   - **Testes unitários** (usando bibliotecas como Jest ou Mocha).
   - **Testes de integração**.
   - Uso de **Docker** para contêinerização do projeto.
   - **Documentação** bem detalhada.
   - **Padrão de código** com uso de linter (Ex: ESLint).
   - Colocar o projeto rodando em algum serviço **cloud** (AWS, Heroku, etc.).

## O que **não** devo fazer:

1. **Não ignorar o uso das tecnologias obrigatórias**.
   - **Node.js**, **TypeScript**, **Express**, **MongoDB** e **Mongoose** são essenciais e **não podem ser substituídos** por outras tecnologias.

2. **Não ignorar a especificação do desafio**.
   - Tarefas não relacionadas ao que foi pedido ou funcionalidades extras que não agregam ao objetivo podem ser desconsideradas.

3. **Não esquecer de tratar erros e exceções**.
   - O projeto deve ser robusto, com tratamento adequado de falhas e erros.

4. **Não deixar de seguir o padrão RESTful** na implementação dos endpoints.

5. **Não ignorar a segurança**.
   - Não exponha dados sensíveis e certifique-se de que a aplicação não tem vulnerabilidades.

6. **Não esquecer da arquitetura e organização do código**.
   - O projeto deve ser bem estruturado, com separação de responsabilidades e arquivos bem organizados.

7. **Não enviar mensagens de commit fora do padrão**.
   - Utilize o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) para garantir uma consistência nas mensagens de commit.

8. **Não negligenciar a documentação**.
   - O arquivo `README.md` é obrigatório e deve conter todas as instruções necessárias para configurar e rodar o projeto.

---

**Caso tenha alguma dúvida, não hesite em entrar em contato com a pessoa responsável pelo desafio. Boa sorte!**