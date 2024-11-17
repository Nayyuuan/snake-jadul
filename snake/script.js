// Seleksi elemen
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const gameOverNotification = document.querySelector('.game-over-notification');
const restartButton = document.getElementById('restartBtn'); // Tombol "Play Again"

// Variabel game
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Mendapatkan high score dari localStorage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Fungsi untuk update posisi makanan
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Fungsi untuk menampilkan notifikasi Game Over
const showGameOver = () => {
    gameOverNotification.style.display = 'block'; // Tampilkan notifikasi
    // Menyembunyikan kontrol tombol
    controls.forEach(button => button.style.display = 'none');
}

// Fungsi untuk menangani game over
const handleGameOver = () => {
    clearInterval(setIntervalId); // Hentikan permainan
    showGameOver(); // Tampilkan notifikasi game over
}

// Fungsi untuk mengubah arah ular
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Menangani klik kontrol
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

// Fungsi untuk memulai game
const initGame = () => {
    if (gameOver) return handleGameOver(); // Jika game over, tampilkan notifikasi

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Jika ular makan makanan
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Menambah posisi makanan ke tubuh ular
        score++; // Menambah skor
        highScore = score >= highScore ? score : highScore; // Update high score jika perlu
        localStorage.setItem("high-score", highScore); // Menyimpan high score
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Update posisi kepala ular
    snakeX += velocityX;
    snakeY += velocityY;

    // Geser tubuh ular ke depan
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Set posisi tubuh ular pertama

    // Periksa jika ular keluar dari batas
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return handleGameOver(); // Game over jika keluar
    }

    // Periksa tabrakan dengan tubuh ular
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            return handleGameOver(); // Game over jika tabrakan dengan tubuh sendiri
        }
    }

    // Update grid playboard
    playBoard.innerHTML = html;
}

// Update posisi makanan
updateFoodPosition();

// Menjalankan permainan
setIntervalId = setInterval(initGame, 100);

// Mendengarkan input keyboard
document.addEventListener("keyup", changeDirection);

// Fungsi untuk me-restart permainan
restartButton.addEventListener('click', () => {
    gameOverNotification.style.display = 'none'; // Sembunyikan notifikasi
    controls.forEach(button => button.style.display = 'block'); // Tampilkan kontrol tombol
    score = 0; // Reset skor
    snakeX = 5; snakeY = 5; // Reset posisi ular
    snakeBody = []; // Reset tubuh ular
    velocityX = 0; velocityY = 0; // Reset kecepatan
    updateFoodPosition(); // Reset makanan
    setIntervalId = setInterval(initGame, 100); // Mulai ulang game
});
