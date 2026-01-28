console.log("Website loaded successfully.");

function loadContent() {
    const pages = ['home', 'about', 'works', 'experience', 'education', 'references'];
    pages.forEach(page => {
        fetch(`${page}.html`)
            .then(response => response.text())
            .then(data => {
                const contentId = `${page}-content`;
                const element = document.getElementById(contentId);
                if (element) {
                    element.innerHTML = data;
                    element.id = page;
                    element.classList.add('content-box');
                }
            })
            .catch(error => console.error(`Error loading ${page}.html:`, error));
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
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

window.addEventListener('load', function () {
    loadContent();
    setTimeout(setupSmoothScroll, 100);
});
