// Importy
import { createContext, useContext, useState } from 'react';

// Typy
type Language = 'pl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Tłumaczenia
const translations = {
  pl: {
    'nav.home': 'Home',
    'nav.about': 'O mnie',
    'nav.projects': 'Projekty',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    // ... reszta tłumaczeń
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    // ... reszta tłumaczeń
  }
};

// Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider
function LanguageProvider({ children }) {
  const [language, setLanguage] = useState<Language>('pl');

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook
function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Eksport
window.LanguageProvider = LanguageProvider;
window.useLanguage = useLanguage; 

// Inicjalizacja strony
document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        pl: {
            // Development & AI
            'skills.dev.title': 'Development & AI',
            // AI & Blockchain
            'skills.ai.title': 'AI & Blockchain',
            // E-commerce & Marketing
            'skills.ecommerce.title': 'E-commerce & Marketing',
            // Tools & Automation
            'skills.tools.title': 'Tools & Automation',
            // Soft Skills
            'skills.soft.title': 'Umiejętności Miękkie',
            'skills.soft.creativity': 'Kreatywność',
            'skills.soft.teamwork': 'Praca zespołowa',
            'skills.soft.independence': 'Samodzielność',
            'skills.soft.proactivity': 'Proaktywność',
            'skills.soft.communication': 'Komunikacja',
            'skills.soft.diligence': 'Skrupulatność',
            'skills.soft.management': 'Zarządzanie',
            'skills.soft.english': 'Angielski (B2)',
            // Nagłówki
            'header.title': 'AI & E-commerce Ekspert',
            'header.subtitle': 'Łączę sztuczną inteligencję z sukcesem w e-commerce',
            // Menu
            'nav.home': 'Strona główna',
            'nav.about': 'O mnie',
            'nav.skills': 'Umiejętności',
            'nav.projects': 'Projekty',
            'nav.contact': 'Kontakt'
        },
        en: {
            // Development & AI
            'skills.dev.title': 'Development & AI',
            // AI & Blockchain
            'skills.ai.title': 'AI & Blockchain',
            // E-commerce & Marketing
            'skills.ecommerce.title': 'E-commerce & Marketing',
            // Tools & Automation
            'skills.tools.title': 'Tools & Automation',
            // Soft Skills
            'skills.soft.title': 'Soft Skills',
            'skills.soft.creativity': 'Creativity',
            'skills.soft.teamwork': 'Team Work',
            'skills.soft.independence': 'Independence',
            'skills.soft.proactivity': 'Proactivity',
            'skills.soft.communication': 'Communication',
            'skills.soft.diligence': 'Diligence',
            'skills.soft.management': 'Management',
            'skills.soft.english': 'English (B2)',
            // Headers
            'header.title': 'AI & E-commerce Expert',
            'header.subtitle': 'Combining AI with e-commerce success',
            // Menu
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact'
        }
    };

    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Language handling
    const langToggle = document.getElementById('language-toggle');
    let currentLang = localStorage.getItem('lang') || 'pl';

    function setLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('lang', lang);
        updateContent(lang);
    }

    function updateContent(lang) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'pl' ? 'en' : 'pl';
        setLanguage(currentLang);
    });

    // Initial language setup
    setLanguage(currentLang);
});

// Ładowanie projektów z GitHub
async function loadProjects() {
    try {
        const username = 'norbertflas'; // Zamień na swoją nazwę użytkownika GitHub
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        
        if (!response.ok) {
            throw new Error('Nie udało się pobrać projektów');
        }
        
        const projects = await response.json();
        const projectsGrid = document.querySelector('#projects .grid');
        
        if (!projectsGrid) {
            console.error('Nie znaleziono kontenera na projekty');
            return;
        }

        projectsGrid.innerHTML = ''; // Wyczyść istniejące projekty

        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Błąd ładowania projektów:', error);
        const projectsGrid = document.querySelector('#projects .grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="col-span-full text-center text-white">
                    <p class="text-xl">Nie udało się załadować projektów</p>
                    <p class="text-sm">Spróbuj odświeżyć stronę</p>
                </div>
            `;
        }
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card p-6 animate-fadeInUp';
    
    // Filtruj puste lub null wartości
    const description = project.description || 'Brak opisu';
    const topics = project.topics || [];
    
    card.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${project.name}</h3>
        <p class="text-gray-300 mb-4">${description}</p>
        ${topics.length > 0 ? `
            <div class="flex flex-wrap gap-2 mb-4">
                ${topics.map(topic => `
                    <span class="px-2 py-1 bg-primary/20 rounded-full text-sm">
                        ${topic}
                    </span>
                `).join('')}
            </div>
        ` : ''}
        <div class="flex gap-4">
            <a href="${project.html_url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-primary">
                <i class="fab fa-github mr-2"></i>GitHub
            </a>
            ${project.homepage ? `
                <a href="${project.homepage}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn btn-secondary">
                    <i class="fas fa-external-link-alt mr-2"></i>Demo
                </a>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Animacje przy przewijaniu
function initAnimations() {
    const elements = document.querySelectorAll('.animate-fadeInUp');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
}

// Obsługa formularza kontaktowego
function initContactForm() {
    const form = document.querySelector('#contact form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
        submitBtn.disabled = true;

        try {
            // Tutaj dodaj logikę wysyłania formularza
            await new Promise(resolve => setTimeout(resolve, 1000)); // Symulacja wysyłania
            
            alert('Wiadomość została wysłana!');
            form.reset();
        } catch (error) {
            alert('Wystąpił błąd podczas wysyłania wiadomości.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Płynne przewijanie
function initSmoothScroll() {
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
} 