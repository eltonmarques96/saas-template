# My BookShelf

## Backend
O backend terá que ter um API Gateway pois contaremos com dois microserviços
1 - Sistema de cadastro e busca de livros
Os livros não serão cadastrados manualmente, eles serão cadastrados por demanda, utilizando a API do https://openlibrary.org/developers/api. E seguirá o seguinte fluxo:
  - O usuário buscará pelo livro na barra de pesquisa
  - Se o livro já estiver cadastrado no banco de dados, retorna as informações do Banco
  - Se o livro não estiver cadastrado no banco de dados, será buscado ele no OpenLibrary, e se encontrado será cadastrado no banco de dados, se não for encontrado será exibida uma mensagem para o usuário.
- O livro deve ser salvo no banco de dados com as seguintes informações:
  - ID
  - Título
  - URL da capa do livro
  - Sinopse
  - Avaliação
  - Número de páginas
  - Data de lançamento
  - Editora
  - ISBN
  - URL do página do livro no site
  - Nome do Autor
  - Link da pagina do autor
  - Avaliação (Padrão: 5 estrelas)
  - Categorias
  - Link para a página das categorias
- O autor deve ser salvo no banco de dados com as seguintes informações:
  - ID
  - Nome
  - Link da pagina do autor
- A categoria deve ser salva no banco de dados com as seguintes informações:
  - ID
  - Nome
  - Link para a página das categorias

Mantenha a estrutura de usuário, login, validação de usuário, senha esquecida, middleware para rota privada e página inicial do dashboard, já presente no projeto utilizando o NestJS.
O usuário poderá atrelar um livro a sua coleção, e poderá remover um livro da sua coleção.
O usuário poderá ter mais de um coleção, e poderá adicionar um livro a mais de uma coleção (Crie uma tabela no banco para coleções).
O usuário poderá colocar um texto de avaliação do livro, e indicar quantas estrelas o livro merece (Crie uma tabela no banco para as avaliações)


2 - Sistema de pesquisa utilizando o Elasticsearch
Ao realizar na barra de pesquisa, será feita uma chamada para API de pesquisa que retornará os seguintes dados:
- Nome do Livro
- Nome do Autor
- URL da capa do livro
- ID do Livro
- URL do página do livro no site

## Frontend
O frontend será responsável por exibir as informações dos livros cadastrados, é essencial que o frontend seja responsivo e que tenha renderização do lado do servidor pois precisamos que as páginas sejam estáticas para o SEO pois utilizaremos também monetização via Google Adsense. A criação das páginas será por demanda, mas assim que uma página for criada ela deverá ser salva no servidor e deve ser mantida para que o SEO ranqueie aquela página para sempre. Inicialmente exibiremos as seguintes informações dos livros:
- Nome
- Capa
- Sinopse
- Número de páginas
- Data de lançamento
- Editora
- ISBN
- URL do página do livro no site
- Nome do Autor
- Link da pagina do autor
- Categorias
- Link para a página das categorias
- Número de estrelas
- Avaliações

Também teremos que gerar páginas estáticas para os autores, exibindo as seguintes informações:
- Nome
- Livros
- Fotos

Também teremos que gerar páginas estáticas para as categorias, exibindo as seguintes informações:
- Nome
- Livros (Ordenando pelos mais bem avaliados)


A homepage será uma página com uma barra de pesquisa, e a listagem dos livros mais acessados, seguido da listagem por categorias.
O site contará com os seguintes idiomas:
- Inglês
- Português
- Espanhol
- Francês
- Alemão
A pessoa poderá navegar pelo site sem estar logada, mas para adicionar livros a coleção ou avaliar, precisará estar logada.

## Mobile
O mobile será responsável por exibir as informações dos livros cadastrados, é essencial que o mobile seja responsivo Inicialmente exibiremos as seguintes informações dos livros:
- Nome
- Capa
- Sinopse
- Número de páginas
- Data de lançamento
- Editora
- ISBN
- URL do página do livro no site
- Nome do Autor
- Link da pagina do autor
- Categorias
- Link para a página das categorias
- Número de estrelas
- Avaliações

Também teremos que gerar páginas estáticas para os autores, exibindo as seguintes informações:
- Nome
- Livros
- Fotos

Também teremos que gerar páginas estáticas para as categorias, exibindo as seguintes informações:
- Nome
- Livros (Ordenando pelos mais bem avaliados)

Em todas as páginas dentro do app exibiremos anúncios via Admob.

A homepage será uma página com uma barra de pesquisa, e a listagem dos livros mais acessados, seguido da listagem por categorias.
O app contará com os seguintes idiomas:
- Inglês
- Português
- Espanhol
- Francês
- Alemão
A pessoa poderá navegar pelo app sem estar logada, mas para adicionar livros a coleção ou avaliar, precisará estar logada.

## Admin
Inicialmente listaremos apenas os usuários e as informações do livros cadastrados, com o número de visitas de cada livro

Cria um arquivo PROJECT.md na raiz com o plano completo
- Como as partes vão se comunicar entre si
- TUdo que precisa ser salvo no banco de dados
- Todas as rotas da API
- Ordem de implementação

Para padrão de segurança
- Server Fat, Client Thin, nada será validado no client tudo passará pelo backend de forma a ser validada