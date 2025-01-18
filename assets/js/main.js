// Inicjalizacja AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true
});

// Ładowanie projektów
async function loadProjects() {
    try {
        const response = await fetch('https://api.github.com/users/norbertflas/repos');
        const projects = await response.json();
        
        const projectGrid = document.querySelector('.project-grid');
        if (!projectGrid) return;

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-aos', 'fade-up');
            
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description || 'Brak opisu'}</p>
                <div class="project-links">
                    <a href="${project.html_url}" target="_blank">Zobacz na GitHub</a>
                </div>
            `;
            
            projectGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Błąd ładowania projektów:', error);
    }
}

// Obsługa formularza kontaktowego
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Tutaj możesz dodać logikę wysyłania formularza
        alert('Dziękujemy za wiadomość!');
        contactForm.reset();
    });
}

document.addEventListener('DOMContentLoaded', loadProjects); 