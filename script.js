// Sample course data
const courses = [
    {
        id: 1,
        title: "JavaScript Completo",
        description: "Aprenda JavaScript do básico ao avançado com projetos práticos.",
        category: "tech",
        price: "R$ 199",
        rating: 4.8,
        image: "💻",
        instructor: "João Silva",
        duration: "40 horas"
    },
    {
        id: 2,
        title: "Design UI/UX",
        description: "Crie interfaces incríveis e experiências de usuário memoráveis.",
        category: "design",
        price: "R$ 249",
        rating: 4.9,
        image: "🎨",
        instructor: "Maria Santos",
        duration: "35 horas"
    },
    {
        id: 3,
        title: "Marketing Digital",
        description: "Domine as estratégias de marketing digital para alavancar seu negócio.",
        category: "business",
        price: "R$ 179",
        rating: 4.7,
        image: "📈",
        instructor: "Carlos Oliveira",
        duration: "30 horas"
    },
    {
        id: 4,
        title: "Python para Data Science",
        description: "Análise de dados e machine learning com Python.",
        category: "tech",
        price: "R$ 299",
        rating: 4.9,
        image: "🐍",
        instructor: "Ana Costa",
        duration: "50 horas"
    },
    {
        id: 5,
        title: "Gestão de Projetos",
        description: "Metodologias ágeis e gestão eficiente de projetos.",
        category: "business",
        price: "R$ 159",
        rating: 4.6,
        image: "📊",
        instructor: "Pedro Lima",
        duration: "25 horas"
    },
    {
        id: 6,
        title: "Photoshop Avançado",
        description: "Técnicas avançadas de edição e manipulação de imagens.",
        category: "design",
        price: "R$ 189",
        rating: 4.8,
        image: "🖼️",
        instructor: "Lucia Ferreira",
        duration: "28 horas"
    }
];

// User data (simulated)
let currentUser = null;
let userCourses = [
    { id: 1, title: "JavaScript Completo", progress: 75 },
    { id: 2, title: "Design UI/UX", progress: 45 },
    { id: 4, title: "Python para Data Science", progress: 20 }
];

// DOM Elements
const coursesGrid = document.getElementById('coursesGrid');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const dashboard = document.getElementById('dashboard');
const userCoursesContainer = document.getElementById('userCourses');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderCourses('all');
    setupEventListeners();
    animateStats();
    setupScrollAnimations();
});

// Event Listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCourses(this.dataset.category);
        });
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Render courses
function renderCourses(category) {
    const filteredCourses = category === 'all' 
        ? courses 
        : courses.filter(course => course.category === category);

    coursesGrid.innerHTML = filteredCourses.map(course => `
        <div class="course-card fade-in">
            <div class="course-image">
                ${course.image}
            </div>
            <div class="course-content">
                <span class="course-category">${getCategoryName(course.category)}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span class="course-price">${course.price}</span>
                    <div class="course-rating">
                        <span class="stars">⭐⭐⭐⭐⭐</span>
                        <span>${course.rating}</span>
                    </div>
                </div>
                <button class="btn-primary btn-full" onclick="enrollCourse(${course.id})">
                    Inscrever-se
                </button>
            </div>
        </div>
    `).join('');
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'tech': 'Tecnologia',
        'business': 'Negócios',
        'design': 'Design'
    };
    return categories[category] || category;
}

// Modal functions
function showLogin() {
    loginModal.style.display = 'block';
}

function showRegister() {
    registerModal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchToRegister() {
    closeModal('loginModal');
    showRegister();
}

function switchToLogin() {
    closeModal('registerModal');
    showLogin();
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate login
    if (email && password) {
        currentUser = {
            name: 'Usuário Demo',
            email: email
        };
        
        closeModal('loginModal');
        showDashboard();
        showNotification('Login realizado com sucesso!', 'success');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Simulate registration
    if (name && email && password) {
        currentUser = {
            name: name,
            email: email
        };
        
        closeModal('registerModal');
        showDashboard();
        showNotification('Conta criada com sucesso!', 'success');
    }
}

function logout() {
    currentUser = null;
    hideDashboard();
    showNotification('Logout realizado com sucesso!', 'info');
}

// Dashboard functions
function showDashboard() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    document.querySelector('.courses').style.display = 'none';
    document.querySelector('.stats').style.display = 'none';
    dashboard.style.display = 'block';
    
    renderUserCourses();
    updateNavigation();
}

function hideDashboard() {
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.features').style.display = 'block';
    document.querySelector('.courses').style.display = 'block';
    document.querySelector('.stats').style.display = 'block';
    dashboard.style.display = 'none';
    
    updateNavigation();
}

function renderUserCourses() {
    userCoursesContainer.innerHTML = userCourses.map(course => `
        <div class="user-course">
            <div>
                <h4>${course.title}</h4>
                <p>Progresso: ${course.progress}%</p>
            </div>
            <div class="course-progress-mini">
                <div class="progress-mini">
                    <div class="progress-mini-fill" style="width: ${course.progress}%"></div>
                </div>
                <small>${course.progress}%</small>
            </div>
        </div>
    `).join('');
}

function updateNavigation() {
    const authButtons = document.querySelector('.nav-auth');
    if (currentUser) {
        authButtons.innerHTML = `
            <span>Olá, ${currentUser.name}</span>
            <button class="btn-secondary" onclick="logout()">Sair</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn-secondary" onclick="showLogin()">Entrar</button>
            <button class="btn-primary" onclick="showRegister()">Cadastrar</button>
        `;
    }
}

// Course enrollment
function enrollCourse(courseId) {
    if (!currentUser) {
        showLogin();
        showNotification('Faça login para se inscrever no curso', 'warning');
        return;
    }

    const course = courses.find(c => c.id === courseId);
    if (course && !userCourses.find(uc => uc.id === courseId)) {
        userCourses.push({
            id: courseId,
            title: course.title,
            progress: 0
        });
        showNotification(`Inscrito no curso: ${course.title}`, 'success');
    }
}

// Utility functions
function showCourses() {
    document.querySelector('#courses').scrollIntoView({
        behavior: 'smooth'
    });
}

function showDemo() {
    showNotification('Demo em desenvolvimento!', 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Animate statistics
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 40);
}

// Scroll animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .course-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        padding: 20px;
    }
    
    .nav-menu.active .nav-link {
        padding: 10px 0;
        border-bottom: 1px solid #f1f5f9;
    }
`;
document.head.appendChild(style);