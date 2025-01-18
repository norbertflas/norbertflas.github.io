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
    loadProjects();
    initAnimations();
    initContactForm();
    initSmoothScroll();
});

// Obsługa trybu ciemnego
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    const body = document.body;
    
    // Sprawdź zapisany motyw
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeIcon(icon, savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        const newTheme = isDark ? 'dark' : 'light';
        
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

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