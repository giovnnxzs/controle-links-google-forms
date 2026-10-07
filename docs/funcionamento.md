# Funcionamento do Sistema

## 1. Objetivo

O sistema foi desenvolvido para atender a uma necessidade real do ambiente corporativo, permitindo controlar o acesso temporário a formulários utilizados em um processo interno de desligamento de colaboradores.

## 2. Geração de links

O administrador gera um novo link por meio do Google Sheets.

Cada link possui um código único, que permite identificar o acesso correspondente na planilha.

## 3. Primeiro acesso

No primeiro acesso, o sistema registra a data e a hora e inicia o prazo de validade do link.

O prazo configurado neste projeto é de 7 dias.

## 4. Controle de status

Os links podem apresentar três status:

- ⚪ Não acessado
- 🟢 Ativo
- 🔴 Expirado

## 5. Expiração

Após o término do prazo, o link deixa de permitir o acesso ao formulário.

O usuário recebe uma mensagem informando que o link expirou.

## 6. Tecnologias utilizadas

- Google Apps Script
- Google Sheets
- Google Forms
- JavaScript

## 7. Segurança

O repositório não contém dados reais de colaboradores, IDs de planilhas ou URLs privadas da empresa.
