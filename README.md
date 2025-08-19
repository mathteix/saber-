# Saber+ - Plataforma de Materiais Didáticos

Uma plataforma moderna para organizar e encontrar materiais de estudo, desenvolvida em HTML, CSS e JavaScript puro.

## 🚀 Como executar

### Opção 1: Live Server (Recomendado)
1. Instale a extensão "Live Server" no VS Code
2. Abra a pasta do projeto no VS Code
3. Clique com o botão direito no arquivo `index.html`
4. Selecione "Open with Live Server"

### Opção 2: Servidor HTTP simples
\`\`\`bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (se tiver http-server instalado)
npx http-server
\`\`\`

### Opção 3: Abrir diretamente no navegador
Simplesmente abra o arquivo `index.html` no seu navegador.

## 📁 Estrutura do projeto

\`\`\`
saber-plus/
├── index.html          # Página inicial
├── cadastro.html       # Página de cadastro de materiais
├── consulta.html       # Página de consulta/busca
├── admin.html          # Painel administrativo
├── styles.css          # Estilos CSS
├── cadastro.js         # JavaScript do cadastro
├── consulta.js         # JavaScript da consulta
├── admin.js            # JavaScript do admin
└── README.md           # Este arquivo
\`\`\`

## 🔑 Acesso ao Admin

- URL: `/admin.html`
- Senha: `123456`

## 💾 Armazenamento

Os dados são salvos no localStorage do navegador, persistindo mesmo após recarregar a página.

## ✨ Funcionalidades

- ✅ Cadastro de materiais didáticos
- ✅ Busca e filtros avançados
- ✅ Painel administrativo
- ✅ Persistência local de dados
- ✅ Interface responsiva
- ✅ Materiais de exemplo incluídos

## 🎯 Páginas

1. **Página Inicial** (`index.html`) - Landing page com navegação
2. **Cadastro** (`cadastro.html`) - Formulário para adicionar materiais
3. **Consulta** (`consulta.html`) - Busca e visualização de materiais
4. **Admin** (`admin.html`) - Gerenciamento e exclusão de materiais

Desenvolvido com ❤️ para estudantes organizados!
