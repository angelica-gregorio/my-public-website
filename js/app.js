console.log("Website loaded successfully.");

// --- 1. Load External HTML Content ---
// We use 'async' here to ensure we can wait for all files to load before scrolling
async function loadContent() {
    const pages = ['home', 'about', 'works', 'experience', 'education', 'references'];
    
    // Create a list of "promises" (tasks) to load all pages in parallel
    const loadPromises = pages.map(page => {
        return fetch(`${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const contentId = `${page}-content`;
                const element = document.getElementById(contentId);
                if (element) {
                    element.innerHTML = data;
                    // RE-ID: We change the ID to match the Nav Links (e.g. href="#home")
                    element.id = page; 
                    element.classList.add('content-box');
                }
            })
            .catch(error => {
                console.error(`Error loading ${page}.html:`, error);
                const element = document.getElementById(`${page}-content`);
                if(element) element.innerHTML = `<p style="color:red">Error loading ${page}.html. Ensure you are using a Local Server.</p>`;
            });
    });

    // Wait for ALL pages to finish loading
    await Promise.all(loadPromises);
}

// --- 2. Smooth Scrolling ---
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            // Note: We look for the ID that was renamed in loadContent
            // We remove the '#' from the href to find the ID
            const targetId = href.substring(1); 
            const target = document.getElementById(targetId);
            
            if (target) {
                const menuHeight = 60; // Adjust this if your header covers content
                const targetPosition = target.offsetTop - menuHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Target section not found: ${href}`);
            }
        });
    });
}

// --- 3. Live Clock and Greeting ---
function initializeExperience() {
    let now = new Date();
    let hour = now.getHours();
    let greeting = "// HELLO";

    // Tech-themed greeting logic
    if (hour >= 5 && hour < 12) greeting = "// GOOD MORNING";
    else if (hour >= 12 && hour < 17) greeting = "// GOOD AFTERNOON";
    else if (hour >= 17 && hour < 21) greeting = "// GOOD EVENING";
    else greeting = "// GOOD NIGHT";

    // Update Sidebar Greeting
    const greetingElement = document.getElementById('greeting-display');
    if (greetingElement) {
        greetingElement.innerText = greeting;
    }

    // Update Sidebar Clock
    const clockElement = document.getElementById('clock-display');
    if (clockElement) {
        // Run immediately so we don't wait 1 second for the first update
        const updateClock = () => {
            const currentTime = new Date();
            clockElement.innerText = currentTime.toLocaleTimeString();
        };
        updateClock(); 
        setInterval(updateClock, 1000);
    }
}

// --- 4. Form Handling ---
function handleFormSubmission() {
    const contactForm = document.getElementById('personalForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const nameValue = document.getElementById('userName').value;
            const emailValue = document.getElementById('userEmail').value;
            const messageValue = document.getElementById('userMsg').value;

            console.log("--- Form Submission Received ---");
            console.log("Name:", nameValue);
            console.log("Email:", emailValue);
            console.log("Message:", messageValue);
            console.log("--------------------------------");

            alert("Data captured! Check the browser console (F12).");
            // Optional: clear form after submit
            contactForm.reset();
        });
    }
}

// --- MASTER INITIALIZATION ---
// This single event listener handles everything in the correct order
window.addEventListener('load', async function () {
    console.log("Initializing App...");
    
    // 1. Start static features immediately
    initializeExperience();
    handleFormSubmission();
    
    // 2. Load dynamic content
    // We 'await' here so scrolling setup happens ONLY after content exists
    await loadContent();
    
    // 3. Setup interaction on the now-loaded content
    setupSmoothScroll();
    
    console.log("App Fully Initialized");
});