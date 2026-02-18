console.log("Website loaded successfully.");

// --- 1. Load External HTML Content ---
async function loadContent() {
    const pages = ['home', 'about', 'works', 'experience', 'education', 'references'];
    
    const loadPromises = pages.map(page => {
        return fetch(`${page}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(data => {
                const contentId = `${page}-content`;
                const element = document.getElementById(contentId);
                if (element) {
                    element.innerHTML = data;
                    element.id = page; 
                    element.classList.add('content-box');
                }
            })
            .catch(error => {
                console.error(`Error loading ${page}.html:`, error);
                const element = document.getElementById(`${page}-content`);
                if(element) element.innerHTML = `<p style="color:red">Error loading ${page}.html.</p>`;
            });
    });

    await Promise.all(loadPromises);
}

// --- 2. Smooth Scrolling ---
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1); 
            const target = document.getElementById(targetId);
            
            if (target) {
                const menuHeight = 60; 
                const targetPosition = target.offsetTop - menuHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- 3. Live Clock and Greeting ---
function initializeExperience() {
    let now = new Date();
    let hour = now.getHours();
    let greeting = "// HELLO";

    if (hour >= 5 && hour < 12) greeting = "// GOOD MORNING";
    else if (hour >= 12 && hour < 17) greeting = "// GOOD AFTERNOON";
    else if (hour >= 17 && hour < 21) greeting = "// GOOD EVENING";
    else greeting = "// GOOD NIGHT";

    const greetingElement = document.getElementById('greeting-display');
    if (greetingElement) greetingElement.innerText = greeting;

    const clockElement = document.getElementById('clock-display');
    if (clockElement) {
        const updateClock = () => {
            const currentTime = new Date();
            clockElement.innerText = currentTime.toLocaleTimeString();
        };
        updateClock(); 
        setInterval(updateClock, 1000);
    }
}

// --- 4. Form Handling (VALIDATION & SPAM FILTER) ---
// This replaces the old handleFormSubmission function
function setupFormValidation() {
    const form = document.getElementById("personalForm");
    
    // If form doesn't exist (e.g., on a page without it), stop here
    if (!form) return;

    const emailField = document.querySelector("input[name='email']");
    const messageField = document.querySelector("textarea[name='message']");
    const spamWords = ["free money", "buy now", "click here", "subscribe", "promo"];
    
    // Record when the function runs (Page Load)
    const formLoadTime = Date.now();

    form.addEventListener("submit", function (e) {
        // A. Email Validation
        if (emailField && !emailField.value.includes("@")) {
            e.preventDefault(); 
            alert("Enter a valid email");
            return;
        }

        // B. Time-based Spam Filter (Must take > 2 seconds)
        const submitTime = Date.now();
        const secondsTaken = (submitTime - formLoadTime) / 1000;
        
        if (secondsTaken < 2) {
            e.preventDefault(); 
            alert("Submission was too fast. Please try again.");
            return;
        }

        // C. Keyword Spam Filter
        if (messageField) {
            const message = messageField.value.toLowerCase();
            const containsSpam = spamWords.some(word => message.includes(word));

            if (containsSpam) {
                e.preventDefault();
                alert("Your message contains blocked spam keywords.");
                return;
            }
        }

        // D. Success
        // If we get here, we do NOTHING.
        // We let the browser proceed with action="https://formsubmit.co/..."
        console.log("Validation passed. Sending to FormSubmit...");
    });
}

// --- MASTER INITIALIZATION ---
window.addEventListener('load', async function () {
    console.log("Initializing App...");
    
    // 1. Static features
    initializeExperience();
    
    // 2. Load dynamic content
    await loadContent();
    
    // 3. Setup features that depend on content existing
    setupSmoothScroll();
    
    // 4. Initialize the Form Logic (Now part of the master flow)
    setupFormValidation();
    
    console.log("App Fully Initialized");
});