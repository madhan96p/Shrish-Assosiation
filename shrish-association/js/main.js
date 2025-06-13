// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroStats = document.querySelectorAll('.stat-number');
const ctaButtons = document.querySelectorAll('.cta-button');
const serviceCards = document.querySelectorAll('.service-card');
const projectCards = document.querySelectorAll('.project-card');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contact-form');
const testimonialSlider = document.getElementById('testimonials-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');
const projectModal = document.getElementById('project-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const faqItems = document.querySelectorAll('.faq-item');

// State
let currentTestimonial = 0;
let isScrolling = false;
let projectsData = [];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeParticles();
    initializeProjectFilters();
    initializeTestimonials();
    initializeContactForm();
    initializeScrollEffects();
    initializeCTAButtons();
    initializeProjectModal();
    initializeFAQ();
    loadProjectsData();
});

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only prevent default for anchor links on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update active link
                    updateActiveNavLink(this);

                    // Close mobile menu
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update active navigation based on scroll position
            updateActiveNavOnScroll();
        });
    }
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    if (isScrolling) return;

    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .team-card, .about-card, .value-card, .cert-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Counter Animation
function initializeCounters() {
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const allCounters = document.querySelectorAll('.stat-number[data-target]');
    allCounters.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(function () {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        let displayValue = Math.floor(current);
        if (target === 98) {
            displayValue += '%';
        } else {
            displayValue += '+';
        }
        element.textContent = displayValue;
    }, 16);
}

// Particles
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random position and animation delay
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

    container.appendChild(particle);

    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            createParticle(container);
        }
    }, 15000);
}

// Project Filters
function initializeProjectFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projectsGrid = document.getElementById('projects-grid');

    if (projectsGrid) {
        let filteredProjects;

        if (filter === 'all') {
            filteredProjects = projectsData;
        } else {
            filteredProjects = projectsData.filter(project => project.category === filter);
        }

        projectsGrid.innerHTML = ''; // Clear current projects

        if (filteredProjects.length > 0) {
            filteredProjects.forEach(project => {
                projectsGrid.innerHTML += createProjectCard(project);
            });
        } else {
            projectsGrid.innerHTML = '<p style="text-align: center; color: var(--steel-gray);">No projects found in this category.</p>';
        }
    }
}

// Testimonials
function initializeTestimonials() {
    if (!testimonialSlider) return;

    // Auto-play testimonials
    setInterval(nextTestimonial, 15000);

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);

    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToTestimonial(index));
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    updateTestimonial();
}

function prevTestimonial() {
    currentTestimonial = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
    updateTestimonial();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonial();
}

function updateTestimonial() {
    // Update cards
    testimonialCards.forEach((card, index) => {
        card.classList.toggle('active', index === currentTestimonial);
    });

    // Update dots
    testimonialDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroBackground = document.querySelector('.hero-background');

        if (heroBackground && hero && scrolled < hero.offsetHeight) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Scroll to top functionality
    const scrollToTopBtn = createScrollToTopButton();

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
}

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--secondary-blue);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top.visible {
            opacity: 1 !important;
            visibility: visible !important;
        }
        .scroll-to-top:hover {
            background: var(--primary-blue) !important;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(button);
    return button;
}

// CTA Buttons
function initializeCTAButtons() {
    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            handleCTAClick(target);
        });
    });
}

function handleCTAClick(target) {
    if (target === 'home-builders') {
        showNotification('Welcome! Let\'s discuss your residential project needs.', 'info');
        // Scroll to contact section or redirect to contact page
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = 'contact.html';
        }
    } else if (target === 'business-partners') {
        showNotification('Great! Let\'s explore partnership opportunities.', 'info');
        // Scroll to contact section or redirect to contact page
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = 'contact.html';
        }
    }
}

// Service Cards Interaction
serviceCards.forEach(card => {
    card.addEventListener('click', function () {
        const service = this.getAttribute('data-service');
        showServiceDetails(service);
    });
});

function showServiceDetails(service) {
    const serviceInfo = {
        residential: {
            title: 'Residential Construction',
            details: 'We specialize in custom homes, renovations, and residential complexes with modern design and smart home integration.'
        },
        commercial: {
            title: 'Commercial Projects',
            details: 'Our commercial expertise includes office buildings, retail spaces, and industrial facilities with sustainable materials.'
        },
        infrastructure: {
            title: 'Infrastructure Development',
            details: 'We handle large-scale infrastructure projects including roads, bridges, and public works with long-term durability.'
        }
    };

    const info = serviceInfo[service];
    if (info) {
        showNotification(`${info.title}: ${info.details}`, 'info');
    }
}

// Project Modal
function initializeProjectModal() {
    if (!projectModal) return;

    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeProjectModal);
    }

    // ESC key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && projectModal.style.display === 'block') {
            closeProjectModal();
        }
    });

    // Project card click events
    document.addEventListener('click', function (e) {
        const viewProjectBtn = e.target.closest('.view-project');
        if (viewProjectBtn) {
            e.preventDefault();
            const projectCard = viewProjectBtn.closest('.project-card');
            if (projectCard) {
                openProjectModal(projectCard);
            }
        }
    });
}

function openProjectModal(projectCard) {
    const title = projectCard.querySelector('h3').textContent;
    const type = projectCard.querySelector('.project-type').textContent;
    const location = projectCard.querySelector('.project-location').textContent;
    const image = projectCard.querySelector('img').src;

    const modalContent = `
        <div class="project-modal-header">
            <img src="${image}" alt="${title}" style="width: 100%; height: 300px; object-fit: cover;">
        </div>
        <div class="project-modal-content" style="padding: 2rem;">
            <div class="project-modal-badge" style="display: inline-block; background: var(--secondary-blue); color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; margin-bottom: 1rem;">${type}</div>
            <h2 style="font-size: 2rem; color: var(--primary-blue); margin-bottom: 0.5rem;">${title}</h2>
            <p style="color: var(--steel-gray); margin-bottom: 2rem;"><strong>Location:</strong> ${location}</p>
            
            <div class="project-details" style="margin-bottom: 2rem;">
                <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">Project Details</h3>
                <p style="color: var(--steel-gray); line-height: 1.6; margin-bottom: 1rem;">
                    This project showcases our commitment to engineering excellence and innovative construction solutions. 
                    Our team delivered exceptional results while maintaining the highest standards of quality and safety.
                </p>
                
                <div class="project-features" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
                    <div class="feature" style="background: var(--light-gray); padding: 1rem; border-radius: 8px;">
                        <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Timeline</h4>
                        <p style="color: var(--steel-gray);">Completed on schedule</p>
                    </div>
                    <div class="feature" style="background: var(--light-gray); padding: 1rem; border-radius: 8px;">
                        <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Quality</h4>
                        <p style="color: var(--steel-gray);">Exceeds industry standards</p>
                    </div>
                    <div class="feature" style="background: var(--light-gray); padding: 1rem; border-radius: 8px;">
                        <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Sustainability</h4>
                        <p style="color: var(--steel-gray);">Eco-friendly materials</p>
                    </div>
                </div>
            </div>
            
            <div class="project-actions" style="text-align: center;">
                <a href="contact.html" class="btn-primary" style="display: inline-block; background: var(--secondary-blue); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Start Your Project</a>
            </div>
        </div>
    `;

    modalBody.innerHTML = modalContent;
    projectModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    projectModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// FAQ
function initializeFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                const isActive = item.classList.contains('active');

                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Load Projects Data
if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            projectType: document.getElementById("projectType").value,
            budget: document.getElementById("budget").value,
            timeline: document.getElementById("timeline").value,
            message: document.getElementById("message").value,
            newsletter: document.getElementById("newsletter").checked
        };

        const submitBtn = contactForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        const scriptURL = "https://script.google.com/macros/s/AKfycbwzRchGBCZ3ruHAX0KUa5CBG1K65wQk_XhRLmXHos78hDeTDdto3j1tr46Vrw8gc-vPHg/exec"; // your new GAS endpoint

        try {
            await fetch(scriptURL, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "no-cors"
            });

            // Optional WhatsApp confirmation
            const message = `Hello ShRish Association,%0A%0A*New Project Inquiry*%0AName: ${formData.firstName} ${formData.lastName}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AProject Type: ${formData.projectType}%0ABudget: ${formData.budget}%0ATimeline: ${formData.timeline}%0A---%0A${formData.message}`;
            const whatsapp = confirm("Form submitted successfully! Want to confirm via WhatsApp?");
            if (whatsapp) {
                window.open(`https://wa.me/919176500207?text=${message}`, "_blank");
            }

            contactForm.reset();
            submitBtn.innerText = "Send Message";
            submitBtn.disabled = false;
        } catch (error) {
            alert("Submission failed. Please try again later.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Message";
            console.error("Contact form error:", error);
        }
    });
}

AOS.init(); // if you're using animations
async function loadProjectsData() {
    try {
        const response = await fetch('data/projects.json');
        if (response.ok) {
            projectsData = await response.json();
            renderProjects();
        } else {
            // Fallback to default projects if JSON file doesn't exist
            loadDefaultProjects();
        }
    } catch (error) {
        console.log('Loading default projects...');
        loadDefaultProjects();
    }
}

function loadDefaultProjects() {
    projectsData = [
        {
            id: 1,
            title: "Balaji Medical Centre",
            type: "Healthcare Facility",
            category: "commercial", // Assuming it's a commercial project
            location: "13.0384219, 80.2388125",
            image: "https://lh3.googleusercontent.com/gpms-cs-s/AB8u6HanvA2IF9bpa37ugmzYc50EATJdt0iwqzUnV6kD98yUKOkG5Xn5qMtdvTsg-wZKIw5kS9ltJUA6cuqiiRdt1HpIUEhyVVhBJHFLkCk2KPeon_fm7CPi194Dqo28GI29hLxBFfY=w900-h600-k-no-pi-35.44310601022916-ya92.22976309850492-ro0-fo100",
            description: "A modern healthcare facility designed for accessibility and efficiency, located in the heart of Chennai.",
            featured: true,
            mapLink: "https://www.google.com/maps/place/Balaji+Medical+Centre/@13.0384815,80.2388369,3a,90y,175.23h,125.44t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgICqt5TKPA!2e10!3e11!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAB8u6HanvA2IF9bpa37ugmzYc50EATJdt0iwqzUnV6kD98yUKOkG5Xn5qMtdvTsg-wZKIw5kS9ltJUA6cuqiiRdt1HpIUEhyVVhBJHFLkCk2KPeon_fm7CPi194Dqo28GI29hLxBFfY%3Dw900-h600-k-no-pi-35.44310601022916-ya92.22976309850492-ro0-fo100"
        },
        {
            id: 2,
            title: "Sree Ganesh Mahal - Poonamallee",
            type: "Event Hall",
            category: "commercial", // still fits unless you want to split 'event' as a category
            location: "Poonamallee, Chennai",
            image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nobfpeY9jYB1FSqnDD71h5uBQEAm26R7TL6MMh4wpdGB91Wuu6kVRj7DGUaRvqOrxFFzL3v9r-F2iXTL_9VZzACPkBCgGj1LZQUiaE54Unca5eqSTeiol8r6bULBiw18p5S0bs=w203-h114-k-no",
            description: "A landmark event hall known for hosting weddings and corporate functions with modern facilities and easy accessibility.",
            featured: true,
            mapLink: "https://www.google.com/maps/place/Sree+Ganesh+Mahal/@13.0663345,80.177396,3a,77.3y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgID309OZWQ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAC9h4nobfpeY9jYB1FSqnDD71h5uBQEAm26R7TL6MMh4wpdGB91Wuu6kVRj7DGUaRvqOrxFFzL3v9r-F2iXTL_9VZzACPkBCgGj1LZQUiaE54Unca5eqSTeiol8r6bULBiw18p5S0bs%3Dw203-h114-k-no!7i1024!8i576"
        }
        ,
        {
            id: 3,
            title: "Balaji Medical Centre – Cuddalore",
            type: "Healthcare Facility",
            category: "commercial",
            location: "Cuddalore, Tamil Nadu",
            image: "https://lh3.googleusercontent.com/p/AF1QipO7AwmxSIb-UW4LxhALVE4sNwBQbwbHqrSB23FS=w203-h152-k-no",
            description: "A modern multi-specialty medical centre in the heart of Cuddalore, known for advanced healthcare services and patient-centric infrastructure.",
            featured: true,
            mapLink: "https://www.google.com/maps/place/Balaji+Medical+Centre+Cuddalore/@11.7625089,79.7526606,3a,75y,317.69h,92.05t/data=!3m7!1e1!3m5!1skdwp36T05ZXDSVY5cNa0nQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-2.0511792376475455%26panoid%3Dkdwp36T05ZXDSVY5cNa0nQ%26yaw%3D317.68952438698483!7i13312!8i6656"
        },
        {
            id: 4,
            title: "Balaji Medical Center – Thoraipakkam",
            type: "Healthcare Facility",
            category: "infrastructure",
            location: "Thoraipakkam, Chennai",
            image: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-7.76&panoid=GqLw5U7zbqDGs8q5pdDBUA&yaw=11.90",
            description: "A well-established medical center serving the Thoraipakkam community with outpatient care, diagnostics, and primary health services.",
            featured: false,
            mapLink: "https://www.google.com/maps/place/Balaji+Medical+Center/@12.933474,80.2312154,3a,75y,11.9h,97.76t/data=!3m7!1e1!3m5!1sGqLw5U7zbqDGs8q5pdDBUA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-7.762619913668303%26panoid%3DGqLw5U7zbqDGs8q5pdDBUA%26yaw%3D11.904729161466435!7i16384!8i8192"
        },
        {
            id: 5,
            title: "Balaji Medical Centre - Mangalore",
            type: "Medical Facility",
            category: "healthcare",
            location: "Mangalore, Karnataka",
            image: "assets/img/Commercial.jpg", // or your actual path
            featured: false
        },
        {
            id: 6,
            title: "In-progress Sites at Velachery",
            type: "Construction",
            category: "residential", // or "mixed-use" if it's a blend
            location: "Velachery, Chennai",
            image: "assets/img/velachery-site.jpg", // plug in your image path here
            featured: false
        }

    ];

    renderProjects();
}

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsPreview = document.getElementById('projects-preview');

    if (projectsGrid) {
        // Render all projects for projects page
        projectsGrid.innerHTML = projectsData.map(project => createProjectCard(project)).join('');
    }

    if (projectsPreview) {
        // Render only featured projects for home page
        const featuredProjects = projectsData.filter(project => project.featured).slice(0, 2);
        projectsPreview.innerHTML = featuredProjects.map(project => createProjectCard(project)).join('');
    }
}

function createProjectCard(project) {
    return `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <button class="view-project">View Details</button>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p class="project-type">${project.type}</p>
                <p class="project-location">${project.location}</p>
            </div>
        </div>
    `;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : type === 'error' ? '#ef4444' : 'var(--secondary-blue)'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Keyboard Navigation
document.addEventListener('keydown', function (e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu) {
        navMenu.classList.remove('active');
    }

    // Arrow keys for testimonial navigation
    if (testimonialCards.length > 0) {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
        }
    }
});

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(function () {
    updateActiveNavOnScroll();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Touch/Swipe Support for Testimonials
let touchStartX = 0;
let touchEndX = 0;

if (testimonialSlider) {
    testimonialSlider.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    testimonialSlider.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextTestimonial();
        } else {
            prevTestimonial();
        }
    }
}

// Accessibility Improvements
function initializeAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1002;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', function () {
        this.style.top = '6px';
    });

    skipLink.addEventListener('blur', function () {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('.hero, .page-header');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
}

// Initialize accessibility features
initializeAccessibility();

// Error Handling
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // Could send error to analytics service
});

// Page Visibility API for performance
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Pause animations or reduce activity when page is hidden
        document.body.classList.add('page-hidden');
    } else {
        // Resume normal activity when page is visible
        document.body.classList.remove('page-hidden');
    }
});

// Console welcome message
console.log('%c🏗️ ShRish Construction Website', 'color: #1e3a8a; font-size: 20px; font-weight: bold;');
console.log('%cBuilding Dreams into Reality', 'color: #3b82f6; font-size: 14px;');
console.log('%cWebsite loaded successfully!', 'color: #10b981; font-size: 12px;');

// Interactive Engineering Diagram Script
class EngineeringDiagram {
    constructor() {
        this.infoPanel = document.getElementById('infoPanel');
        this.infoContent = document.getElementById('infoContent');
        this.closeBtn = document.getElementById('closeBtn');
        this.clickableElements = document.querySelectorAll('.clickable-element');
        this.activeElement = null;

        // Control buttons
        this.toggleGridBtn = document.getElementById('toggleGrid');
        this.toggleDimensionsBtn = document.getElementById('toggleDimensions');
        this.toggleLabelsBtn = document.getElementById('toggleLabels');

        // State tracking
        this.state = {
            gridVisible: true,
            dimensionsVisible: true,
            labelsVisible: true
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupInitialState();
    }

    bindEvents() {
        // Clickable elements
        this.clickableElements.forEach(element => {
            element.addEventListener('click', (e) => this.handleElementClick(e));
            element.addEventListener('mouseenter', (e) => this.handleElementHover(e));
            element.addEventListener('mouseleave', (e) => this.handleElementLeave(e));
        });

        // Close button
        this.closeBtn.addEventListener('click', () => this.hideInfoPanel());

        // Control buttons
        this.toggleGridBtn.addEventListener('click', () => this.toggleGrid());
        this.toggleDimensionsBtn.addEventListener('click', () => this.toggleDimensions());
        this.toggleLabelsBtn.addEventListener('click', () => this.toggleLabels());

        // Click outside to close info panel
        document.addEventListener('click', (e) => {
            if (!this.infoPanel.contains(e.target) && !e.target.classList.contains('clickable-element')) {
                this.hideInfoPanel();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    setupInitialState() {
        this.hideInfoPanel();
    }

    handleElementClick(e) {
        e.stopPropagation();
        const element = e.currentTarget;
        const info = element.getAttribute('data-info');

        // Remove active class from previous element
        if (this.activeElement) {
            this.activeElement.classList.remove('active');
        }

        // Add active class to current element
        element.classList.add('active');
        this.activeElement = element;

        // Show info panel with element information
        this.showInfoPanel(info);

        // Add some interactive feedback
        this.addClickAnimation(element);
    }

    handleElementHover(e) {
        const element = e.currentTarget;
        if (!element.classList.contains('active')) {
            element.style.transform = 'scale(1.02)';
        }
    }

    handleElementLeave(e) {
        const element = e.currentTarget;
        if (!element.classList.contains('active')) {
            element.style.transform = 'scale(1)';
        }
    }

    showInfoPanel(content) {
        this.infoContent.innerHTML = content;
        this.infoPanel.classList.add('show');
    }

    hideInfoPanel() {
        this.infoPanel.classList.remove('show');
        if (this.activeElement) {
            this.activeElement.classList.remove('active');
            this.activeElement.style.transform = 'scale(1)';
            this.activeElement = null;
        }
    }

    addClickAnimation(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'clickPulse 0.6s ease-out';

        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    toggleGrid() {
        this.state.gridVisible = !this.state.gridVisible;
        const grid = document.querySelector('.blueprint-grid');

        if (this.state.gridVisible) {
            grid.classList.remove('hidden');
            this.toggleGridBtn.classList.remove('active');
        } else {
            grid.classList.add('hidden');
            this.toggleGridBtn.classList.add('active');
        }
    }

    toggleDimensions() {
        this.state.dimensionsVisible = !this.state.dimensionsVisible;
        const dimensions = document.querySelectorAll('.dimension');

        dimensions.forEach(dim => {
            if (this.state.dimensionsVisible) {
                dim.classList.remove('hidden');
                this.toggleDimensionsBtn.classList.remove('active');
            } else {
                dim.classList.add('hidden');
                this.toggleDimensionsBtn.classList.add('active');
            }
        });
    }

    toggleLabels() {
        this.state.labelsVisible = !this.state.labelsVisible;
        const labels = document.querySelectorAll('.label');

        labels.forEach(label => {
            if (this.state.labelsVisible) {
                label.classList.remove('hidden');
                this.toggleLabelsBtn.classList.remove('active');
            } else {
                label.classList.add('hidden');
                this.toggleLabelsBtn.classList.add('active');
            }
        });
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'Escape':
                this.hideInfoPanel();
                break;
            case 'g':
            case 'G':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleGrid();
                }
                break;
            case 'd':
            case 'D':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleDimensions();
                }
                break;
            case 'l':
            case 'L':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleLabels();
                }
                break;
        }
    }

    // Method to programmatically highlight an element
    highlightElement(selector) {
        const element = document.querySelector(selector);
        if (element && element.classList.contains('clickable-element')) {
            this.handleElementClick({ currentTarget: element, stopPropagation: () => { } });
        }
    }

    // Method to reset all interactions
    reset() {
        this.hideInfoPanel();
        this.state = {
            gridVisible: true,
            dimensionsVisible: true,
            labelsVisible: true
        };

        // Reset visual states
        document.querySelector('.blueprint-grid').classList.remove('hidden');
        document.querySelectorAll('.dimension').forEach(dim => dim.classList.remove('hidden'));
        document.querySelectorAll('.label').forEach(label => label.classList.remove('hidden'));

        // Reset button states
        this.toggleGridBtn.classList.remove('active');
        this.toggleDimensionsBtn.classList.remove('active');
        this.toggleLabelsBtn.classList.remove('active');
    }
}

// CSS animations to be added dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes clickPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .info-panel.show {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize the interactive diagram when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const diagram = new EngineeringDiagram();

    // Make diagram globally accessible for debugging/external control
    window.engineeringDiagram = diagram;

    // Optional: Add some demo functionality
    console.log('Engineering Diagram loaded. Available methods:');
    console.log('- engineeringDiagram.highlightElement(selector)');
    console.log('- engineeringDiagram.reset()');
    console.log('- Keyboard shortcuts: Esc (close), Ctrl+G (grid), Ctrl+D (dimensions), Ctrl+L (labels)');
});