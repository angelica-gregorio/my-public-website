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
// --- Part B: Enhanced Integration & Spam Filtering ---

// 1. Time-based Filtering: Record the time when the script loads [cite: 59]
const formLoadTime = Date.now();

// Select the form and inputs
const form = document.getElementById("personalForm");
const emailInput = document.getElementById("userEmail");
const messageInput = document.getElementById("userMsg");

// Spam Keywords List [cite: 74]
const spamWords = ["free money", "buy now", "click here", "subscribe", "promo"];

if (form) {
    form.addEventListener("submit", function (e) {
        
        // --- CHECK 1: Email Validation [cite: 29] ---
        if (!emailInput.value.includes("@")) {
            e.preventDefault(); // STOP submission
            alert("Enter a valid email address.");
            return;
        }

        // --- CHECK 2: Time-based Filtering [cite: 55] ---
        // If the user submits in less than 2 seconds, it's likely a bot.
        const submitTime = Date.now();
        const secondsTaken = (submitTime - formLoadTime) / 1000;
        
        if (secondsTaken < 2) {
            e.preventDefault(); // STOP submission
            alert("Submission was too fast. Please try again.");
            return;
        }

        // --- CHECK 3: Spam Keyword Detection [cite: 71] ---
        const message = messageInput.value.toLowerCase();
        // Check if the message contains any of the spam words [cite: 77]
        const containsSpam = spamWords.some(word => message.includes(word));

        if (containsSpam) {
            e.preventDefault(); // STOP submission
            alert("Your message contains blocked spam keywords.");
            return;
        }

        // --- SUCCESS ---
        // If we reach this point, NO validations failed.
        // We do NOT call e.preventDefault().
        // The browser will now execute the <form action="..."> URL and send the email.
    });
}