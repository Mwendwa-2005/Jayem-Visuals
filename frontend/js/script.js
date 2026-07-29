// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const loader = document.getElementById('loader');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const closeBtn = document.getElementById('closeBtn');
const portfolioGrid = document.getElementById('portfolioGrid');
const servicesGrid = document.getElementById('servicesGrid');
const testimonialGrid = document.getElementById('testimonialGrid');
const contactForm = document.getElementById('contactForm');
const bookingForm = document.getElementById('bookingForm');
const toast = document.getElementById('toast');

// ============================================
// Loading Screen
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// ============================================
// Navigation
// ============================================
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

closeBtn.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    toastIcon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} toast-icon`;
    toastIcon.style.color = type === 'success' ? '#4caf50' : '#ef5350';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ============================================
// Portfolio Functions
// ============================================
async function fetchPortfolio(category = 'all') {
    try {
        const url = category === 'all' 
            ? `${API_URL}/portfolio`
            : `${API_URL}/portfolio?category=${category}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch portfolio');
        }
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        return [];
    }
}

function renderPortfolio(items) {
    if (!items || items.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-camera"></i>
                <span>No portfolio items available</span>
            </div>
        `;
        return;
    }
    
    portfolioGrid.innerHTML = items.map(item => `
        <div class="portfolio-card" data-category="${item.category}" onclick="openLightbox('${item.imageUrl}', '${item.title}')">
            <img src="${item.imageUrl}" alt="${item.title}" class="portfolio-img" loading="lazy">
            <div class="portfolio-overlay">
                <span class="portfolio-category">${item.category}</span>
                <h3 class="portfolio-title">${item.title}</h3>
                <span class="view-details"><i class="fas fa-search-plus"></i> View</span>
            </div>
        </div>
    `).join('');
}

// Lightbox
function openLightbox(imageUrl, title) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="${imageUrl}" alt="${title}">
            <div class="lightbox-caption">${title}</div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    lightbox.querySelector('.close-lightbox').addEventListener('click', () => {
        lightbox.remove();
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

// Portfolio filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.filter;
        const items = await fetchPortfolio(category);
        renderPortfolio(items);
    });
});

// ============================================
// Services
// ============================================
const servicesData = [
    {
        icon: 'fa-camera-retro',
        title: 'Wildlife Photography',
        description: 'Capture the beauty of nature with stunning wildlife photography in their natural habitats.',
        price: 'Starting at $500'
    },
    {
        icon: 'fa-heart',
        title: 'Wedding Photography',
        description: 'Document your special day with timeless and emotional wedding photography.',
        price: 'Starting at $2000'
    },
    {
        icon: 'fa-calendar-alt',
        title: 'Event Photography',
        description: 'Professional coverage for corporate events, parties, and special occasions.',
        price: 'Starting at $800'
    },
    {
        icon: 'fa-studio',
        title: 'Studio Photography',
        description: 'Professional studio sessions with expert lighting and creative direction.',
        price: 'Starting at $300'
    },
    {
        icon: 'fa-mountain',
        title: 'Outdoor Photography',
        description: 'Breathtaking outdoor portrait sessions in beautiful natural settings.',
        price: 'Starting at $400'
    },
    {
        icon: 'fa-home',
        title: 'Indoor Photography',
        description: 'Intimate indoor portraits and family sessions in the comfort of your home.',
        price: 'Starting at $350'
    }
];

function renderServices() {
    servicesGrid.innerHTML = servicesData.map(service => `
        <div class="service-card animate-on-scroll">
            <div class="service-icon"><i class="fas ${service.icon}"></i></div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-price">${service.price}</div>
        </div>
    `).join('');
}

// ============================================
// Testimonials
// ============================================
async function fetchTestimonials() {
    try {
        const response = await fetch(`${API_URL}/testimonials`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch testimonials');
        }
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

function renderTestimonials(items) {
    if (!items || items.length === 0) {
        testimonialGrid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-comment"></i>
                <span>No testimonials yet</span>
            </div>
        `;
        return;
    }
    
    testimonialGrid.innerHTML = items.map(item => `
        <div class="testimonial-card animate-on-scroll">
            <div class="stars">
                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(item.rating))}
                ${item.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(item.rating))}
            </div>
            <p class="testimonial-text">"${item.content}"</p>
            <div class="testimonial-author">
                <div class="author-img">
                    <img src="${item.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name) + '&background=0D0D0D&color=e63946&size=100'}" alt="${item.name}">
                </div>
                <div class="author-info">
                    <h4>${item.name}</h4>
                    <p>${item.service} Photography</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Contact Form
// ============================================
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const statusDiv = document.getElementById('contactMessageStatus');
    
    try {
        // Here you would typically send the email via your backend
        // For now, we'll simulate success
        statusDiv.className = 'form-status success';
        statusDiv.textContent = 'Thank you for your message! I will get back to you soon.';
        statusDiv.style.display = 'block';
        
        showToast('Message sent successfully!', 'success');
        contactForm.reset();
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    } catch (error) {
        statusDiv.className = 'form-status error';
        statusDiv.textContent = 'Something went wrong. Please try again.';
        statusDiv.style.display = 'block';
        showToast('Failed to send message. Please try again.', 'error');
    }
});

// ============================================
// Booking Form
// ============================================
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const bookingData = Object.fromEntries(formData);
    const statusDiv = document.getElementById('bookingStatus');
    
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            statusDiv.className = 'form-status success';
            statusDiv.textContent = 'Booking request submitted successfully! We will contact you soon.';
            statusDiv.style.display = 'block';
            
            showToast('Booking request submitted!', 'success');
            bookingForm.reset();
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        } else {
            throw new Error(data.message || 'Failed to submit booking');
        }
    } catch (error) {
        statusDiv.className = 'form-status error';
        statusDiv.textContent = error.message || 'Something went wrong. Please try again.';
        statusDiv.style.display = 'block';
        showToast('Failed to submit booking. Please try again.', 'error');
    }
});

// ============================================
// Newsletter
// ============================================
document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    showToast(`Subscribed! Welcome to the newsletter.`, 'success');
    input.value = '';
});

// ============================================
// Scroll Animations
// ============================================
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
            el.classList.add('show');
        }
    });
}

// ============================================
// Initialize
// ============================================
async function init() {
    // Load portfolio
    const portfolioItems = await fetchPortfolio();
    renderPortfolio(portfolioItems);
    
    // Load testimonials
    const testimonialItems = await fetchTestimonials();
    renderTestimonials(testimonialItems);
    
    // Render services
    renderServices();
    
    // Handle scroll animations
    handleScrollAnimations();
    window.addEventListener('scroll', handleScrollAnimations);
}

// Start the application
init();

// ============================================
// Smooth scrolling for navigation links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Background parallax effect
// ============================================
window.addEventListener('scroll', () => {
    const bgImage = document.getElementById('bgImage');
    const scrolled = window.pageYOffset;
    bgImage.style.transform = `translateY(${scrolled * 0.1}px) scale(1.1)`;
});

console.log('Willfred Jayem Photography - Website Loaded Successfully