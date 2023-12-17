# **DOCKER**
Docker é uma plataforma Open Source que possibilita o empacotamento de uma aplicação dentro
de um container. Uma aplicação consegue se adequar e rodar em qualquer máquina que tenha essa
tecnologia instalada.

Uma imagem de container do Docker
é um pacote de software leve, autônomo e executável que inclui tudo o que é necessário para
executar um aplicativo: código, tempo de execução, ferramentas do sistema, bibliotecas do sistema
e configurações.

**_Container:_** é o local onde a sua aplicação ficará rodando.

**_Imagem:_** É como um snapshot. Outros desenvolvedores com acesso a esta imagem, terão os mesmos
recursos que você utiliza e configurou em seu container.

# Listar images
Lista as imagens utilizadas na criação de um container
```
» docker images
REPOSITORY                    TAG           IMAGE ID       CREATED       SIZE
docker/disk-usage-extension   0.2.7         94a994303197   5 weeks ago   2.81MB
postgres                      15.2-alpine   ddc12ac7fa27   8 weeks ago   243MB
```

# Listar containers
## 1) Para listar somente os containers ativos.
```
Esse comando irá exibir quais são os containers criados que estão rodando:

» docker container ls
ou
» docker ps
```
## 2) Para listar todos os container existentes (ativos ou não)

Qualquer um dos dois comandos pode ser usado **docker container ls -a** ou **docker ps -a**

- exemplo de Container running
```

» docker container ls -a

CONTAINER ID   IMAGE            COMMAND                 CREATED       STATUS  PORTS
89e3ca1294fb   postgres:15.2   "docker-entrypoint.s…"   6 weeks ago   Up      0.0.0.0:5433->5432/tcp
```
- exemplo de Container stopped
```
» docker ps -a

CONTAINER ID   IMAGE                  COMMAND                  CREATED       STATUS                     PORTS
89e3ca1294fb   postgres:15.2-alpine   "docker-entrypoint.s…"   6 weeks ago   Exited (0) 7 seconds ago

```
# Parar um container
```
» docker stop <container_ID>
```
# Lista as imagens existentes na maquina.
```
» docker images
```
# Remover imagens.
```
» docker rmi ubuntu
```
```
» docker rmi <iamge_name>
```
# Mata todos os container existentes
É possível apagar todos os containers e imagens de uma só vez. Para isso, basta um pouco de shell script:
O comando dentro do parenteses traz o id de todos os container.
```
» docker rm -f $(docker container ls -a -q)
```
```
O mesmo serve para apagar imagens:
» docker rmi $(docker images -q)
```
# Criar volume.
O Docker possui um mecanismo de gerenciamento de volumes que com ele é possível compartilhar-
mos um volume da nossa máquina com o container.

Um volume pode ser um diretório localizado fora do sistema
de arquivos de um container. O Docker permite especificar
diretórios no container para que possam ser mapeados no sistema
de arquivos do host.
```
» docker volume create pg_data
```
# Cria o containers com postgres
Cria um container para rodar o BD Postgres utilizando uma imagem aparcom um SO linux minimalista (alpine), orientada para eficiencia de recurso e segurança.
```
» docker run --name db_postgresql -e "POSTGRES_USER=<username>" -e "POSTGRES_PASSWORD=<password>" -v pg_data:/var/lib/postgresql/data -p 5433:5432 -d postgres:15.2-alpine
```
parametros do comando
```
v - especifica volume
e - enviroment variables
d - execute o container em segundo plano
```
# Docker file
“O Dockerfile é um arquivo de texto que contém as instruções necessárias para criar uma nova
imagem de contêiner. Essas instruções incluem a identificação de uma imagem existente a ser usada
como uma base, comandos a serem executados durante o processo de criação da imagem e um
comando que será executado quando novas instâncias da imagem de contêiner forem implantadas.”

# **DOCKER COMPOSE**
O docker-compose é uma ferramenta do Docker que, a partir de diversas especificações, permite
subir diversos containeres e relacioná-los através de redes internas.

Orquestrar os varios containers de
uma aplicação. Por exemplo você pode construir um container para
a aplicação (node) e outro para o banco de dados, isso é feito através da criação de um arquivo chamado de docker-compose.yaml e posterior build

# Docker Compose file.
Este arquivo especifica instruções para build um volume e container com postgres
```
version: '3.8'

volumes:
  pg_data:

services:
  database:
    container_name: postgres_container
    image: postgres:15.2-alpine
    env_file: .env
    environment:
      - POSTGRES_USER=${DATABASE_USER}
      - POSTGRES_PASSWORD=${DATABASE_PASSWORD}
      - POSTGRES_DB=mycompras
    ports:
      - "5433:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
```
**version:** declara a versão do docker compose.

**services:** declara quais serviços serão rodados, nesse caso, chamaremos de laravel-app.

**build:** declara o nome da imagem, ou, no caso, se declararmos o ., ele irá “chamar” a imagem
declarada no Dockerfile.

**ports:** realiza a liberação das portas. Nesse exemplo, queremos que seja liberada a porta 8080, porém,
quando acessada, seja feito um redirecionamento para a porta 80 de nosso container.

As variavéis abaixo são utilizadas na construção do container para não expor informações sensiveis diretamente no comando de criação.
 - ${DATABASE_USER} - Obtem login name
 -  ${DATABASE_PASSWORD} - Obtem a password

# Create and start containers
- Cria e inicializa os containers especificado no arquivo .yaml
  existente na raiz do projeto, em caso de alguma alteração no
  arquivo .yml só será recriado o containers que foi alterado.

- O docker-compose up irá rodar o docker-compose, baseado em nosso docker-compose.yaml e com
o -d o container é inicializado em segundo plano e podemos utilizar o nosso terminal para outros
comandos.
```
» docker-compose up -d
```
- Cria o container com o nome do projeto "compras"
```
» docker-compose -p, --project-name compras up -d
```
# Build or rebuild services
- Realiza apenas a parte de builder das images que serão utilizadas.
```
» docker-compose build
```

# Parar todos os containers
```
» docker-compose stop
```

# Dockerfile x Docker-composefile
- Docker file é para criarmos a imagem da nossas aplicação.
```
“O Dockerfile é um arquivo de texto que contém as instruções necessárias para criar uma nova
imagem de contêiner. Essas instruções incluem a identificação de uma imagem existente a ser usada
como uma base, comandos a serem executados durante o processo de criação da imagem e um
comando que será executado quando novas instâncias da imagem de contêiner forem implantadas.”
```
- Docker-compose file é a receita para montar os nossos containers.
```
"O docker-compose é uma ferramenta do Docker que, a partir de diversas especificações, permite
subir diversos containeres e relacioná-los através de redes internas".
```
