## Image Manager

Uma API de upload de Imagens utilizando o serviço CMS da Cloudinary

## Setup

### Dependencias

Para a aplicação ser utilizada corretamente, é necessário as seguintes
dependencias serem configuradas:

- Banco PostgreSQL
- Conta da Cloudinary (https://cloudinary.com/)
- Node versão 18 ou superior

Tambem é necessário configurar as seguintes variáveis de ambiente

```bash
DATABASE_URL=postgresql://img-mgr:img-mgr@localhost:5432/image_mgr # url de conexão com sua instância no banco de dados
JWT_SECRET=secret # um segredo aleatório para criptografar JWTs. Utilize um valor longo e difícil de ser memoridado. Sugestão, no terminal execute: `openssl rand -base64 32`
JWT_EXPIRES_IN=1d # tempo de expiração do token
CLOUDINARY_CLOUD_NAME=cloudname # nome da cloud oferecido pelo cloudinary. Obtido em https://console.cloudinary.com/settings
CLOUDINARY_API_KEY=apikey # chave de api da cloudinary. Obtido em https://console.cloudinary.com/settings
CLOUDINARY_API_SECRET=secret # chave de segurança da api da cloudinary. Obtido em https://console.cloudinary.com/settings
```

É importante que o usuário do banco de dados tenha permissão de criação de
tabelas no banco de dados e que o nome de usuário e senha correspondam àqueles
encontrados na url de conexão. A saber, a url de conexão segue o seguinte
padrão: `postgresql://usuário:senha@host:porta/nome_do_banco_de_dados`.
Siga as instruções neste site para realizar a configuração do seu banco
de dados: https://chatgpt.com/share/30d615ee-c597-4ac9-b56a-4ee8db926a8e

Para a criação da conta na cloudinary, siga as instruções neste site:
https://cloudinary.com/documentation/how_to_integrate_cloudinary .
Em seguida, siga estas instruções para obter seu token de API no seguinte vídeo
https://youtu.be/ok9mHOuvVSI

## Documentação da API
