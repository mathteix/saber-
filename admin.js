// Estado da aplicação
let isAuthenticated = false
let materials = []
let materialToDelete = null

// Elementos do DOM
const loginScreen = document.getElementById("login-screen")
const adminPanel = document.getElementById("admin-panel")
const loginForm = document.getElementById("login-form")
const passwordInput = document.getElementById("password")
const togglePasswordBtn = document.getElementById("toggle-password")
const logoutBtn = document.getElementById("logout-btn")
const refreshBtn = document.getElementById("refresh-materials")
const totalMaterials = document.getElementById("total-materials")
const adminLoading = document.getElementById("admin-loading")
const materialsList = document.getElementById("materials-list")
const adminEmptyState = document.getElementById("admin-empty-state")
const deleteModal = document.getElementById("delete-modal")
const deleteMaterialTitle = document.getElementById("delete-material-title")
const cancelDeleteBtn = document.getElementById("cancel-delete")
const confirmDeleteBtn = document.getElementById("confirm-delete")
const toast = document.getElementById("toast")

// Senha do admin (em produção, isso deveria ser mais seguro)
const ADMIN_PASSWORD = "123456"

// Funções de login e logout
function handleLogin(event) {
  event.preventDefault()
  const password = passwordInput.value
  if (password === ADMIN_PASSWORD) {
    isAuthenticated = true
    loginScreen.style.display = "none"
    adminPanel.style.display = "block"
    loadMaterials()
    showToast("Login realizado com sucesso! 🚀", "success")
  } else {
    showToast("Senha incorreta. Tente novamente.", "error")
  }
}

function handleLogout() {
  isAuthenticated = false
  loginScreen.style.display = "block"
  adminPanel.style.display = "none"
  materialsList.innerHTML = ""
  totalMaterials.textContent = "0"
  showEmptyState(true)
  showToast("Logout realizado com sucesso! 👋", "success")
}

// Função para alternar a visibilidade da senha
function togglePassword() {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
  passwordInput.setAttribute("type", type)
  togglePasswordBtn.textContent = type === "password" ? "Mostrar" : "Ocultar"
}

// Adicionar materiais de exemplo se não existirem
function initializeSampleMaterials() {
  const existingMaterials = localStorage.getItem("materiais_didaticos")

  if (!existingMaterials) {
    const sampleMaterials = [
      {
        id: 1,
        titulo: "Fundamentos de Álgebra Linear",
        descricao: "Livro completo sobre álgebra linear com exercícios práticos",
        autor: "João Silva Santos",
        categoria_id: 1,
        categoria_nome: "Matemática",
        tipo_material: "livro",
        nivel_ensino: "superior",
        disciplina: "Matemática",
        ano_publicacao: 2023,
        editora: "Editora Acadêmica",
        isbn: "",
        url_arquivo: "",
        palavras_chave: "álgebra, linear, matrizes, vetores",
        ativo: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        titulo: "Gramática Essencial da Língua Portuguesa",
        descricao: "Guia completo de gramática para ensino médio",
        autor: "Maria Oliveira Costa",
        categoria_id: 2,
        categoria_nome: "Português",
        tipo_material: "apostila",
        nivel_ensino: "medio",
        disciplina: "Português",
        ano_publicacao: 2022,
        editora: "Editora Escolar",
        isbn: "",
        url_arquivo: "",
        palavras_chave: "gramática, português, sintaxe, morfologia",
        ativo: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        titulo: "Introdução à Biologia Celular",
        descricao: "Material didático sobre estrutura e função celular",
        autor: "Dr. Carlos Mendes",
        categoria_id: 3,
        categoria_nome: "Ciências",
        tipo_material: "apresentacao",
        nivel_ensino: "medio",
        disciplina: "Biologia",
        ano_publicacao: 2023,
        editora: "Editora Científica",
        isbn: "",
        url_arquivo: "",
        palavras_chave: "biologia, célula, organelas, membrana",
        ativo: true,
        created_at: new Date().toISOString(),
      },
    ]

    localStorage.setItem("materiais_didaticos", JSON.stringify(sampleMaterials))
    showToast("Materiais de exemplo adicionados! 📚", "success")
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar materiais de exemplo se necessário
  initializeSampleMaterials()

  // Event listeners
  loginForm.addEventListener("submit", handleLogin)
  togglePasswordBtn.addEventListener("click", togglePassword)
  logoutBtn.addEventListener("click", handleLogout)
  refreshBtn.addEventListener("click", loadMaterials)
  cancelDeleteBtn.addEventListener("click", closeDeleteModal)
  confirmDeleteBtn.addEventListener("click", confirmDelete)

  // Fechar modal ao clicar fora
  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal()
    }
  })
})

// Carregar materiais
function loadMaterials() {
  if (!isAuthenticated) return

  showLoading(true)

  try {
    const storedMaterials = localStorage.getItem("materiais_didaticos")

    // Garantir que sempre temos um array válido
    if (storedMaterials) {
      const parsedMaterials = JSON.parse(storedMaterials)
      materials = Array.isArray(parsedMaterials) ? parsedMaterials : []
    } else {
      materials = []
    }

    console.log("Materiais carregados:", materials) // Debug
    totalMaterials.textContent = materials.length

    if (materials.length === 0) {
      showEmptyState(true)
      materialsList.innerHTML = ""
    } else {
      showEmptyState(false)
      renderMaterials()
    }
  } catch (error) {
    console.error("Erro ao carregar materiais:", error)
    showToast("Erro ao carregar materiais.", "error")
    materials = [] // Garantir que é um array vazio
    totalMaterials.textContent = "0"
    showEmptyState(true)
    materialsList.innerHTML = ""
  } finally {
    showLoading(false)
  }
}

// Renderizar materiais
function renderMaterials() {
  // Verificação de segurança
  if (!Array.isArray(materials)) {
    console.error("materials não é um array:", materials)
    materials = []
    showEmptyState(true)
    return
  }

  if (materials.length === 0) {
    showEmptyState(true)
    materialsList.innerHTML = ""
    return
  }

  materialsList.innerHTML = materials
    .map(
      (material) => `
        <div class="admin-material-card">
            <div class="material-header">
                <div class="material-title-section">
                    <h3 class="material-title">${escapeHtml(material.titulo || "Título não informado")}</h3>
                    <div class="material-badges">
                        <span class="badge badge-${material.tipo_material || "default"}">
                            ${capitalizeFirst(material.tipo_material || "Não informado")}
                        </span>
                        <span class="badge badge-outline">
                            ${escapeHtml(material.categoria_nome || "Categoria não informada")}
                        </span>
                        ${
                          material.nivel_ensino
                            ? `
                            <span class="badge badge-${material.nivel_ensino}">
                                ${capitalizeFirst(material.nivel_ensino)}
                            </span>
                        `
                            : ""
                        }
                    </div>
                </div>
                <button onclick="deleteMaterial(${material.id || 0}, '${escapeHtml(material.titulo || "Material")}')" 
                        class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
            <div class="material-content">
                ${
                  material.descricao
                    ? `
                    <p class="material-description">${escapeHtml(material.descricao)}</p>
                `
                    : ""
                }
                
                <div class="material-info">
                    ${
                      material.autor
                        ? `
                        <div class="material-info-item">
                            <strong>Autor:</strong> ${escapeHtml(material.autor)}
                        </div>
                    `
                        : ""
                    }
                    ${
                      material.editora
                        ? `
                        <div class="material-info-item">
                            <strong>Editora:</strong> ${escapeHtml(material.editora)}
                        </div>
                    `
                        : ""
                    }
                    ${
                      material.ano_publicacao
                        ? `
                        <div class="material-info-item">
                            <strong>Ano:</strong> ${material.ano_publicacao}
                        </div>
                    `
                        : ""
                    }
                    ${
                      material.disciplina
                        ? `
                        <div class="material-info-item">
                            <strong>Disciplina:</strong> ${escapeHtml(material.disciplina)}
                        </div>
                    `
                        : ""
                    }
                </div>
                
                ${
                  material.url_arquivo
                    ? `
                    <div class="material-link">
                        <p><strong>Link:</strong></p>
                        <a href="${escapeHtml(material.url_arquivo)}" target="_blank" rel="noopener noreferrer" 
                           class="material-url">
                            ${escapeHtml(material.url_arquivo)}
                        </a>
                    </div>
                `
                    : ""
                }
                
                <div class="material-meta">
                    ID: ${material.id || "N/A"} | Criado em: ${formatDate(material.created_at || new Date().toISOString())}
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Excluir material
function deleteMaterial(id, title) {
  materialToDelete = { id, title }
  deleteMaterialTitle.textContent = title
  deleteModal.style.display = "flex"
}

// Confirmar exclusão
function confirmDelete() {
  if (!materialToDelete) return

  try {
    materials = materials.filter((m) => m.id !== materialToDelete.id)
    localStorage.setItem("materiais_didaticos", JSON.stringify(materials))

    showToast(`Material "${materialToDelete.title}" excluído! 🗑️`, "success")
    loadMaterials()
    closeDeleteModal()
  } catch (error) {
    console.error("Erro ao excluir material:", error)
    showToast("Erro ao excluir material.", "error")
  }
}

// Fechar modal de exclusão
function closeDeleteModal() {
  deleteModal.style.display = "none"
  materialToDelete = null
}

// Mostrar/ocultar loading
function showLoading(show) {
  adminLoading.style.display = show ? "block" : "none"
}

// Mostrar/ocultar empty state
function showEmptyState(show) {
  adminEmptyState.style.display = show ? "block" : "none"
}

// Mostrar toast
function showToast(message, type = "success") {
  toast.textContent = message
  toast.className = `toast ${type}`
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 4000)
}

// Utilitários
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR")
}
