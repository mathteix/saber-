// Mapeamento de categorias
const categorias = {
  1: "Matemática",
  2: "Português",
  3: "Ciências",
  4: "História",
  5: "Geografia",
  6: "Física",
  7: "Química",
  8: "Inglês",
  9: "Educação Física",
  10: "Arte",
}

// Elementos do DOM
const form = document.getElementById("material-form")
const submitBtn = document.getElementById("submit-btn")
const reloadBtn = document.getElementById("reload-btn")
const materialsCount = document.getElementById("materials-count")
const toast = document.getElementById("toast")

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  updateMaterialsCount()

  // Event listeners
  form.addEventListener("submit", handleSubmit)
  reloadBtn.addEventListener("click", handleReload)
})

// Atualizar contador de materiais
function updateMaterialsCount() {
  try {
    const materiais = JSON.parse(localStorage.getItem("materiais_didaticos") || "[]")
    if (materiais.length > 0) {
      materialsCount.textContent = `💾 ${materiais.length} materiais salvos`
      materialsCount.style.display = "flex"
    } else {
      materialsCount.style.display = "none"
    }
  } catch (error) {
    console.error("Erro ao contar materiais:", error)
    materialsCount.style.display = "none"
  }
}

// Manipular envio do formulário
async function handleSubmit(e) {
  e.preventDefault()

  // Validação
  const titulo = document.getElementById("titulo").value.trim()
  const categoria = document.getElementById("categoria").value
  const tipoMaterial = document.getElementById("tipo_material").value

  if (!titulo) {
    showToast("O título é obrigatório.", "error")
    return
  }

  if (!categoria) {
    showToast("Selecione uma categoria.", "error")
    return
  }

  if (!tipoMaterial) {
    showToast("Selecione o tipo de material.", "error")
    return
  }

  // Desabilitar botão
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...'

  try {
    // Coletar dados do formulário
    const formData = new FormData(form)
    const material = {
      id: Date.now(),
      titulo: formData.get("titulo"),
      descricao: formData.get("descricao") || "",
      autor: formData.get("autor") || "",
      categoria_id: Number.parseInt(formData.get("categoria")),
      categoria_nome: categorias[Number.parseInt(formData.get("categoria"))],
      tipo_material: formData.get("tipo_material"),
      nivel_ensino: formData.get("nivel_ensino") || "",
      disciplina: formData.get("disciplina") || "",
      ano_publicacao: formData.get("ano_publicacao") ? Number.parseInt(formData.get("ano_publicacao")) : 0,
      editora: formData.get("editora") || "",
      isbn: formData.get("isbn") || "",
      url_arquivo: formData.get("url_arquivo") || "",
      palavras_chave: formData.get("palavras_chave") || "",
      ativo: true,
      created_at: new Date().toISOString(),
    }

    // Salvar no localStorage
    const materiais = JSON.parse(localStorage.getItem("materiais_didaticos") || "[]")
    materiais.push(material)
    localStorage.setItem("materiais_didaticos", JSON.stringify(materiais))

    // Sucesso
    showToast(`Material "${material.titulo}" salvo com sucesso! 🎉💾`, "success")

    // Limpar formulário
    form.reset()

    // Atualizar contador
    updateMaterialsCount()
  } catch (error) {
    console.error("Erro ao salvar material:", error)
    showToast("Erro ao salvar material. Tente novamente.", "error")
  } finally {
    // Reabilitar botão
    submitBtn.disabled = false
    submitBtn.innerHTML = '<i class="fas fa-save"></i> 💾 Salvar Localmente'
  }
}

// Recarregar página
function handleReload() {
  location.reload()
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
    updateMaterialsCount()
    showToast("Materiais de exemplo adicionados! 📚", "success")
  }
}

// Adicionar materiais de exemplo na primeira visita
if (!localStorage.getItem("materiais_didaticos")) {
  addSampleMaterials()
}
