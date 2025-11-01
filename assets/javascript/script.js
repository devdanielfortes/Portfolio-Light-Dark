const body = document.getElementById('body-main');
const toggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setInitialTheme() {
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        body.classList.remove('dark-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

setInitialTheme();


const typingTextElement = document.getElementById('typing-text');
const texts = [
    "Transformando Código em Soluções", 
    "Futuro Engenheiro de Software",
    "Tecnologia é a Resposta"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = texts[textIndex];
    
    if (!isDeleting) {
        typingTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    } else {
        typingTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length; 
        setTimeout(type, 500); 
        return;
    }

    const typingSpeed = isDeleting ? 50 : 100; 
    setTimeout(type, typingSpeed);
}

document.addEventListener('DOMContentLoaded', type);


const observerOptions = {
    threshold: 0.1 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
const formUrl = contactForm.getAttribute('action'); 

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const button = contactForm.querySelector('button[type="submit"]');
    
    button.disabled = true;
    button.textContent = 'Enviando...';
    formFeedback.textContent = ''; 

    const formData = new FormData(contactForm);

    try {
        const response = await fetch(formUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' 
            }
        });

        if (response.ok) {
            formFeedback.style.color = 'var(--cor-destaque)';
            formFeedback.textContent = 'Mensagem enviada com sucesso! Em breve, entrarei em contato.';
            
            button.textContent = 'Enviado ✔';
            
            setTimeout(() => {
                contactForm.reset(); 
                button.textContent = 'Enviar Mensagem >';
                button.disabled = false;
                formFeedback.textContent = ''; 
            }, 5000); 
            
        } else {
            const data = await response.json();
            let errorMessage = "Ocorreu um erro no envio. Tente novamente.";
            if (data.errors) {
                errorMessage = data.errors.map(err => err.message).join(", ");
            } else if (data.error) {
                 errorMessage = data.error;
            }

            formFeedback.style.color = 'red';
            formFeedback.textContent = 'ERRO: ' + errorMessage;
            
            button.textContent = 'Enviar Mensagem >';
            button.disabled = false;
        }

    } catch (error) {
        formFeedback.style.color = 'red';
        formFeedback.textContent = 'Erro de conexão. Verifique sua rede e tente novamente.';
        
        button.textContent = 'Enviar Mensagem >';
        button.disabled = false;
    }
});