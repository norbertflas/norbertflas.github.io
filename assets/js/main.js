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
    initThemeToggle();
    initLanguageToggle();
    loadProjects();
    initAnimations();
    initContactForm();
    initSmoothScroll();
});

// Obsługa trybu ciemnego
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Sprawdź zapisany motyw
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(icon, savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Obsługa języka
function initLanguageToggle() {
    const langToggle = document.getElementById('language-toggle');
    let currentLang = localStorage.getItem('lang') || 'pl';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'pl' ? 'en' : 'pl';
        localStorage.setItem('lang', currentLang);
        updateContent(currentLang);
    });
}

// Ładowanie projektów z GitHub
async function loadProjects() {
    try {
        const response = await fetch('https://api.github.com/users/norbertflas/repos');
        const projects = await response.json();
        
        const projectsGrid = document.querySelector('#projects .grid');
        projectsGrid.innerHTML = ''; // Wyczyść istniejące projekty

        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Błąd ładowania projektów:', error);
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card p-6 animate-fadeInUp';
    
    card.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${project.name}</h3>
        <p class="text-gray-300 mb-4">${project.description || 'Brak opisu'}</p>
        <div class="flex gap-4">
            <a href="${project.html_url}" target="_blank" class="btn btn-primary">
                <i class="fab fa-github mr-2"></i>GitHub
            </a>
            ${project.homepage ? `
                <a href="${project.homepage}" target="_blank" class="btn btn-secondary">
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