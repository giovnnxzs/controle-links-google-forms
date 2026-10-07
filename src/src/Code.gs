// =====================================================
// CONTROLE DE LINKS TEMPORÁRIOS PARA GOOGLE FORMS
// =====================================================
// Projeto: controle-links-google-forms
// Tecnologia: Google Apps Script
//
// O sistema:
// - Gera links únicos
// - Registra o primeiro acesso
// - Define prazo de validade
// - Controla o status do link
// - Impede acesso após a expiração
// - Redireciona para um Google Forms

// =====================================================
// CONFIGURAÇÕES
// =====================================================

// ID da planilha utilizada pelo sistema.
const ID_DA_PLANILHA = "SEU_ID_DA_PLANILHA";

// URL do Google Forms para onde o usuário será direcionado.
const LINK_DO_FORMS = "SEU_LINK_DO_FORMS";

// URL da implantação do Web App.
// Exemplo: https://script.google.com/macros/s/SEU_ID/exec
const URL_WEB_APP = "SUA_URL_DO_WEB_APP";

// Prazo de validade do link.
//
// 7 dias = 10080 minutos
// 48 horas = 2880 minutos
// 5 minutos = 5
const MINUTOS_VALIDADE = 10080;


// =====================================================
// MENU DA PLANILHA
// =====================================================

function onOpen() {

  SpreadsheetApp.getUi()
    .createMenu("🔗 CONTROLE")
    .addItem("Gerar novo link", "gerarLink")
    .addToUi();

}


// =====================================================
// GERAR NOVO LINK
// =====================================================

function gerarLink() {

  const planilha =
    SpreadsheetApp.openById(ID_DA_PLANILHA);

  // Utiliza a primeira aba da planilha.
  const aba =
    planilha.getSheets()[0];

  // Próxima linha disponível.
  const linha =
    aba.getLastRow() + 1;

  // Gera um código único para o link.
  const codigo =
    Utilities.getUuid()
      .replace(/-/g, "")
      .substring(0, 10)
      .toUpperCase();

  // Monta o link individual.
  const link =
    URL_WEB_APP +
    "?codigo=" +
    encodeURIComponent(codigo);


  // ---------------------------------------------------
  // COLUNA A - CÓDIGO
  // ---------------------------------------------------

  aba.getRange(linha, 1)
    .setValue(codigo);


  // ---------------------------------------------------
  // COLUNA B - NOME
  // ---------------------------------------------------
  //
  // O nome pode ser preenchido manualmente depois.
  // O sistema não altera esta coluna.
  // ---------------------------------------------------


  // ---------------------------------------------------
  // COLUNA C - LINK
  // ---------------------------------------------------

  aba.getRange(linha, 3)
    .setValue(link);


  // ---------------------------------------------------
  // COLUNA D - PRIMEIRO ACESSO
  // ---------------------------------------------------

  aba.getRange(linha, 4)
    .clearContent();


  // ---------------------------------------------------
  // COLUNA E - EXPIRA EM
  // ---------------------------------------------------

  aba.getRange(linha, 5)
    .clearContent();


  // ---------------------------------------------------
  // COLUNA F - STATUS
  // ---------------------------------------------------

  aba.getRange(linha, 6)
    .setValue("⚪ Não acessado");


  // Mostra o link gerado.
  SpreadsheetApp.getUi().alert(
    "LINK GERADO!\n\n" + link
  );

}


// =====================================================
// ACESSO AO LINK
// =====================================================

function doGet(e) {

  // Obtém o código enviado pelo link.
  const codigo =
    e.parameter.codigo;


  // Verifica se existe um código.
  if (!codigo) {

    return mensagem(
      "Link inválido",
      "Este link não possui um código."
    );

  }


  // Abre a planilha.
  const planilha =
    SpreadsheetApp.openById(ID_DA_PLANILHA);

  // Utiliza a primeira aba.
  const aba =
    planilha.getSheets()[0];

  // Obtém os dados da planilha.
  const dados =
    aba.getDataRange().getValues();


  // Procura o código na coluna A.
  for (let i = 1; i < dados.length; i++) {

    const codigoPlanilha =
      String(dados[i][0]);


    if (codigoPlanilha === String(codigo)) {

      const linha =
        i + 1;

      // Coluna D - Primeiro acesso
      let primeiroAcesso =
        dados[i][3];

      // Coluna E - Expira em
      let expiracao =
        dados[i][4];


      // ------------------------------------------------
      // PRIMEIRO ACESSO
      // ------------------------------------------------

      if (!primeiroAcesso) {

        primeiroAcesso =
          new Date();

        expiracao =
          new Date(
            primeiroAcesso.getTime() +
            MINUTOS_VALIDADE *
            60 *
            1000
          );


        // Salva o primeiro acesso.
        aba.getRange(linha, 4)
          .setValue(primeiroAcesso);


        // Salva a data de expiração.
        aba.getRange(linha, 5)
          .setValue(expiracao);


        // Atualiza o status.
        aba.getRange(linha, 6)
          .setValue("🟢 Ativo");

      }


      // ------------------------------------------------
      // VERIFICAR EXPIRAÇÃO
      // ------------------------------------------------

      if (
        new Date() >
        new Date(expiracao)
      ) {

        aba.getRange(linha, 6)
          .setValue("🔴 Expirado");


        return mensagem(
          "Link expirado",
          "Este link expirou.<br><br>" +
          "Solicite um novo link."
        );

      }


      // ------------------------------------------------
      // LINK ATIVO
      // ------------------------------------------------

      aba.getRange(linha, 6)
        .setValue("🟢 Ativo");


      // Redireciona para o Google Forms.
      return abrirForms();

    }

  }


  // Código não encontrado.
  return mensagem(
    "Link inválido",
    "Este código não existe."
  );

}


// =====================================================
// ABRIR GOOGLE FORMS
// =====================================================

function abrirForms() {

  return HtmlService.createHtmlOutput(`

    <!DOCTYPE html>

    <html>

    <head>

      <meta charset="UTF-8">

      <meta http-equiv="refresh"
        content="0; url=${LINK_DO_FORMS}">

    </head>

    <body>

      <p style="
        font-family: Arial;
        text-align: center;
        margin-top: 50px;
      ">

        Abrindo formulário...

      </p>


      <script>

        window.top.location.href =
          ${JSON.stringify(LINK_DO_FORMS)};

      </script>

    </body>

    </html>

  `);

}


// =====================================================
// MENSAGEM
// =====================================================

function mensagem(titulo, texto) {

  return HtmlService.createHtmlOutput(`

    <!DOCTYPE html>

    <html>

    <head>

      <meta charset="UTF-8">

      <title>${titulo}</title>

    </head>


    <body style="
      font-family: Arial;
      text-align: center;
      padding: 60px;
    ">

      <h2>${titulo}</h2>

      <p>${texto}</p>

    </body>

    </html>

  `);

}


// =====================================================
// ATUALIZAR STATUS AUTOMATICAMENTE
// =====================================================
//
// Esta função pode ser executada por um acionador
// baseado em tempo.
//
// Recomendação:
// Executar a cada minuto.
//
// Assim, links expirados podem ser identificados
// automaticamente na planilha.
// =====================================================

function atualizarStatus() {

  const planilha =
    SpreadsheetApp.openById(ID_DA_PLANILHA);

  const aba =
    planilha.getSheets()[0];

  const dados =
    aba.getDataRange().getValues();

  const agora =
    new Date();


  for (let i = 1; i < dados.length; i++) {

    // Coluna D - Primeiro acesso
    const primeiroAcesso =
      dados[i][3];

    // Coluna E - Expira em
    const expiracao =
      dados[i][4];


    // -----------------------------------------------
    // LINK AINDA NÃO ACESSADO
    // -----------------------------------------------

    if (!primeiroAcesso) {

      aba.getRange(i + 1, 6)
        .setValue("⚪ Não acessado");

      continue;

    }


    // -----------------------------------------------
    // LINK EXPIRADO
    // -----------------------------------------------

    if (
      expiracao &&
      agora > new Date(expiracao)
    ) {

      aba.getRange(i + 1, 6)
        .setValue("🔴 Expirado");

    }


    // -----------------------------------------------
    // LINK ATIVO
    // -----------------------------------------------

    else {

      aba.getRange(i + 1, 6)
        .setValue("🟢 Ativo");

    }

  }

}
