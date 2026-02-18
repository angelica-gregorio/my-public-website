function initBounceCanvas() {
    const canvas = document.getElementById('bounceCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const ball = {
        x: 0,
        y: 0,
        dx: 4,
        dy: 3,
        radius: 15,
        color: '#a855f7'
    };

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();

        canvas.width = rect.width || canvas.parentElement.offsetWidth;
        canvas.height = rect.height || canvas.parentElement.offsetHeight || 200;
        width = canvas.width;
        height = canvas.height;

        if (ball.x <= 0 || ball.y <= 0 || ball.x > width || ball.y > height) {
            ball.x = width / 2;
            ball.y = height / 2;
        }
    }

    function animate() {
        if (width === 0 || height === 0) {
            requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();

        if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
            ball.dx *= -1;
            ball.x = ball.x - ball.radius < 0 ? ball.radius : width - ball.radius;
        }

        if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
            ball.dy *= -1;
            ball.y = ball.y - ball.radius < 0 ? ball.radius : height - ball.radius;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
}