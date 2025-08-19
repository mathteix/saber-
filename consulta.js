// Estado da aplicação
let allMaterials = []
let filteredMaterials = []

// Elementos do DOM
const searchInput = document.getElementById("search")
const filterCategoria = document.getElementById("filter-categoria")
const filterTipo = document.getElementById("filter-tipo")
const filterNivel = document.getElementById("filter-nivel")
const clearFiltersBtn = document.getElementById("clear-filters")
const refreshBtn = document.getElementById("refresh-btn")
const resultsCount = document.getElementById("results-count")
const resultsContainer = document.getElementById("results-container")
const emptyState = document.getElementById("empty-state")
const loading = document.getElementById("loading")
const toast = document.getElementById("toast")

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadMaterials()

  // Event listeners
  searchInput.addEventListener("input", applyFilters)
  filterCategoria.addEventListener("change", applyFilters)
  filterTipo.addEventListener("change", applyFilters)
  filterNivel.addEventListener("change", applyFilters)
  clearFiltersBtn.addEventListener("click", clearFilters)
  refreshBtn.addEventListener("click", loadMaterials)
})

// Carregar materiais
function loadMaterials() {
  showLoading(true)

  try {
    const materials = JSON.parse(localStorage.getItem("materiais_didaticos") || "[]")
    allMaterials = materials
    applyFilters()

    if (materials.length === 0) {
      showEmptyState(true)
    } else {
      showEmptyState(false)
    }
  } catch (error) {
    console.error("Erro ao carregar materiais:", error)
    showToast("Erro ao carregar materiais.", "error")
    allMaterials = []
    showEmptyState(true)
  } finally {
    showLoading(false)
  }
}

// Aplicar filtros
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase()
  const categoriaFilter = filterCategoria.value
  const tipoFilter = filterTipo.value
  const nivelFilter = filterNivel.value

  filteredMaterials = allMaterials.filter((material) => {
    const matchesSearch =
      !searchTerm ||
      material.titulo.toLowerCase().includes(searchTerm) ||
      material.autor.toLowerCase().includes(searchTerm) ||
      material.descricao.toLowerCase().includes(searchTerm) ||
      material.palavras_chave.toLowerCase().includes(searchTerm)

    const matchesCategoria = !categoriaFilter || material.categoria_nome === categoriaFilter
    const matchesTipo = !tipoFilter || material.tipo_material === tipoFilter
    const matchesNivel = !nivelFilter || material.nivel_ensino === nivelFilter

    return matchesSearch && matchesCategoria && matchesTipo && matchesNivel
  })

  updateResultsCount()
  renderMaterials()
}

// Limpar filtros
function clearFilters() {
  searchInput.value = ""
  filterCategoria.value = ""
  filterTipo.value = ""
  filterNivel.value = ""
  applyFilters()
}

// Atualizar contador de resultados
function updateResultsCount() {
  resultsCount.textContent = `${filteredMaterials.length} material(is) encontrado(s) 📱 Local`
}

// Renderizar materiais
function renderMaterials() {
  if (filteredMaterials.length === 0) {
    resultsContainer.innerHTML = ""
    if (allMaterials.length === 0) {
      showEmptyState(true)
    } else {
      resultsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum material encontrado</h3>
                    <p>Tente ajustar os filtros para encontrar materiais.</p>
                    <button onclick="clearFilters()" class="btn btn-primary">Limpar Filtros</button>
                </div>
            `
      showEmptyState(false)
    }
    return
  }

  showEmptyState(false)

  resultsContainer.innerHTML = filteredMaterials
    .map(
      (material) => `
        <div class="material-card">
            <div class="material-header">
                <div class="material-title-row">
                    <div>
                        <h3 class="material-title">${escapeHtml(material.titulo)}</h3>
                        <div class="material-badges">
                            <span class="badge badge-${material.tipo_material}">
                                ${capitalizeFirst(material.tipo_material)}
                            </span>
                            <span class="badge badge-outline">
                                ${escapeHtml(material.categoria_nome)}
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
                    ${
                      material.url_arquivo
                        ? `
                        <a href="${escapeHtml(material.url_arquivo)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                            <i class="fas fa-external-link-alt"></i>
                            Acessar
                        </a>
                    `
                        : ""
                    }
                </div>
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
                            <i class="fas fa-user"></i>
                            ${escapeHtml(material.autor)}
                        </div>
                    `
                        : ""
                    }
                    ${
                      material.editora
                        ? `
                        <div class="material-info-item">
                            <i class="fas fa-building"></i>
                            ${escapeHtml(material.editora)}
                        </div>
                    `
                        : ""
                    }
                    ${
                      material.ano_publicacao
                        ? `
                        <div class="material-info-item">
                            <i class="fas fa-calendar"></i>
                            ${material.ano_publicacao}
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
                  material.palavras_chave
                    ? `
                    <div class="material-keywords">
                        <p>Palavras-chave:</p>
                        <div class="keywords-list">
                            ${material.palavras_chave
                              .split(",")
                              .map((keyword) => `<span class="keyword-tag">${escapeHtml(keyword.trim())}</span>`)
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        </div>
    `,
    )
    .join("")
}

// Mostrar/ocultar loading
function showLoading(show) {
  loading.style.display = show ? "block" : "none"
}

// Mostrar/ocultar empty state
function showEmptyState(show) {
  emptyState.style.display = show ? "block" : "none"
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

// Adicionar materiais de exemplo se não existirem
function addSampleMaterials() {
  const existingMaterials = JSON.parse(localStorage.getItem("materiais_didaticos") || "[]")

  if (existingMaterials.length === 0) {
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
      {
        id: 4,
        titulo: "Atividade Google Classroom - Matemática",
        descricao: "Material de exercícios disponível no Google Classroom para prática",
        autor: "Professor Teste",
        categoria_id: 1,
        categoria_nome: "Matemática",
        tipo_material: "exercicios",
        nivel_ensino: "medio",
        disciplina: "Matemática",
        ano_publicacao: 2024,
        editora: "Google Classroom",
        isbn: "",
        url_arquivo: "https://classroom.google.com/c/NzQ2NDc3NTQwMzQ2/a/Nzc4NzYzMzYyMDcy/details",
        palavras_chave: "google classroom, exercícios, atividade, matemática, prática",
        ativo: true,
        created_at: new Date().toISOString(),
      },
    ]

    localStorage.setItem("materiais_didaticos", JSON.stringify(sampleMaterials))
    loadMaterials()
    showToast("Materiais de exemplo carregados! 📚", "success")
  }
}

// Adicionar materiais de exemplo na primeira visita
if (!localStorage.getItem("materiais_didaticos")) {
  addSampleMaterials()
}
