# 📸 Álbum dos Convidados: como ativar

A página `fotos.html` funciona em **modo prévia** enquanto `PHOTOS_WEBAPP_URL` (em `js/fotos.js`) estiver vazia.
Para ligar de verdade são duas partes: o Google Drive (obrigatório) e a cópia para o Google Fotos (opcional).

## Parte 1: Drive + planilha (fotos, curtidas e comentários)

1. Abra a planilha "Casamento Alexandre e Larissa" > **Extensões > Apps Script**.
2. Substitua o código do arquivo principal pelo novo `google-sheets-backend.js` desta branch.
3. Clique em **+ > Script**, crie um arquivo chamado `Fotos` e cole o `google-apps-script-fotos.js` inteiro.
4. **Implantar > Gerenciar implantações > lápis (Editar) > Versão: Nova versão > Implantar**.
   O Google vai pedir permissão para acessar o Drive: aceite.
5. Copie a URL do Web App (é a mesma que já está em `js/rsvp-mural.js`) e cole em `PHOTOS_WEBAPP_URL` no `js/fotos.js`.

As fotos vão para a pasta **"Casamento Alexandre & Larissa - Fotos dos Convidados"** no Drive, com as subpastas
Cerimônia, Recepção e Festa. A aba **Fotos** da planilha guarda autor, desafio, curtidas e comentários.

## Parte 2: cópia para o Google Fotos

O Google só deixa um app colocar fotos em álbuns que o próprio app criou. Por isso o script cria três álbuns
novos na conta de vocês: **Casamento - Cerimônia**, **Casamento - Recepção** e **Casamento - Festa**.

1. Entre em <https://console.cloud.google.com> com a conta dona da planilha e crie um projeto (ex.: "Casamento").
2. Em **APIs e serviços > Biblioteca**, procure **Photos Library API** e clique em **Ativar**.
3. Em **APIs e serviços > Tela de permissão OAuth**, configure como **Externo**, preencha nome e e-mail,
   e em **Usuários de teste** adicione o seu e-mail.
4. Copie o **número do projeto** (aparece na página inicial do projeto).
5. No Apps Script: **Configurações do projeto (engrenagem) > Projeto do Google Cloud > Alterar projeto**,
   cole o número e confirme.
6. Ainda em Configurações, marque **"Mostrar arquivo de manifesto appsscript.json"**. Abra o `appsscript.json`
   e adicione (mantendo o que já existe):

   ```json
   "oauthScopes": [
     "https://www.googleapis.com/auth/spreadsheets",
     "https://www.googleapis.com/auth/drive",
     "https://www.googleapis.com/auth/script.external_request",
     "https://www.googleapis.com/auth/script.scriptapp",
     "https://www.googleapis.com/auth/photoslibrary.appendonly"
   ]
   ```

7. No arquivo `Fotos`, selecione a função **ativarSincronizacaoGoogleFotos** e clique em **Executar**.
   Aceite as permissões (vai aparecer "app não verificado": clique em Avançado > Acessar).
8. Implante uma **Nova versão** de novo (passo 4 da Parte 1).

A partir daí, a cada 10 minutos as fotos novas são copiadas para os álbuns do Google Fotos.
Para compartilhar com os convidados, abram o álbum no app Google Fotos e toquem em **Compartilhar**.
