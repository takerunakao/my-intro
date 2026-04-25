document.addEventListener('DOMContentLoaded', () => {
    // Setup Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger animation
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated to keep it visible
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove class to allow re-animation when scrolling back up
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Get all elements that should be animated
    const animatedElements = document.querySelectorAll('.animate-element');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Handle Parallax effect on scroll for abstract shapes or background (optional contemporary touch)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.abstract-shape');
        
        shapes.forEach(shape => {
            const speed = 0.2;
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
        });
    });

    // --- Contemporary Puzzle Logic (Harmony) ---
    const puzzleGrid = document.getElementById('puzzle-grid');
    const successMessage = document.getElementById('success-message');
    const gridSize = 3;
    let gridState = [];
    let startTime = null;
    let moveCount = 0;
    let timerInterval = null;
    const liveStats = document.getElementById('live-stats');
    
    if (puzzleGrid) {
        initPuzzle();
        
        successMessage.addEventListener('click', () => {
            if (!successMessage.classList.contains('hidden')) {
                successMessage.classList.add('hidden');
                
                // Reset state
                for(let i = 0; i < gridState.length; i++) {
                    gridState[i] = false;
                }
                
                startTime = null;
                moveCount = 0;
                if (timerInterval) clearInterval(timerInterval);
                if (liveStats) {
                    liveStats.classList.add('hidden');
                    liveStats.innerText = 'TIME: 0.0s | MOVES: 0';
                }
                
                // Scramble again
                scramblePuzzle();
                renderGrid();
                
                // Unhide the grid
                puzzleGrid.classList.remove('solved');
            }
        });
    }

    function initPuzzle() {
        // Create 3x3 grid
        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement('div');
            tile.classList.add('puzzle-tile');
            tile.dataset.index = i;
            tile.addEventListener('click', () => handleTileClick(i));
            puzzleGrid.appendChild(tile);
            gridState.push(false);
        }

        scramblePuzzle();
        renderGrid();
    }
    
    function scramblePuzzle() {
        // Randomize solvable state
        const moves = 9 + Math.floor(Math.random() * 6);
        for (let i = 0; i < moves; i++) {
            const randomIndex = Math.floor(Math.random() * (gridSize * gridSize));
            toggleTileLogic(randomIndex);
        }
        
        // Ensure it's not already solved initially
        if (checkWin() || checkAllFalse()) {
            toggleTileLogic(0);
            toggleTileLogic(1);
        }
    }

    function handleTileClick(index) {
        if (puzzleGrid.classList.contains('solved')) return;

        if (startTime === null) {
            startTime = Date.now();
            if (liveStats) liveStats.classList.remove('hidden');
            timerInterval = setInterval(updateLiveStats, 100);
        }
        moveCount++;
        if (liveStats) updateLiveStats();

        toggleTileLogic(index);
        renderGrid();
        
        if (checkWin()) {
            handleWin();
        }
    }

    function toggleTileLogic(index) {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        // Toggle target
        gridState[index] = !gridState[index];
        // Toggle top
        if (row > 0) gridState[index - gridSize] = !gridState[index - gridSize];
        // Toggle bottom
        if (row < gridSize - 1) gridState[index + gridSize] = !gridState[index + gridSize];
        // Toggle left
        if (col > 0) gridState[index - 1] = !gridState[index - 1];
        // Toggle right
        if (col < gridSize - 1) gridState[index + 1] = !gridState[index + 1];
    }

    function renderGrid() {
        const tiles = puzzleGrid.querySelectorAll('.puzzle-tile');
        tiles.forEach((tile, i) => {
            if (gridState[i]) {
                tile.classList.add('active');
            } else {
                tile.classList.remove('active');
            }
        });
    }

    function checkWin() {
        // Win if ALL are active
        return gridState.every(state => state === true);
    }
    
    function checkAllFalse() {
        return gridState.every(state => state === false);
    }

    function updateLiveStats() {
        if (!startTime || !liveStats) return;
        const now = Date.now();
        const timeElapsed = ((now - startTime) / 1000).toFixed(1);
        liveStats.innerText = `TIME: ${timeElapsed}s | MOVES: ${moveCount}`;
    }

    function handleWin() {
        if (timerInterval) clearInterval(timerInterval);
        if (liveStats) liveStats.classList.add('hidden');
        
        puzzleGrid.classList.add('solved');
        
        const endTime = Date.now();
        const timeElapsed = startTime ? ((endTime - startTime) / 1000).toFixed(1) : "0.0";
        const score = Math.max(0, 50000 - Math.floor(timeElapsed * 100) - (moveCount * 50));
        
        const statsDiv = document.getElementById('game-stats');
        if (statsDiv) {
            statsDiv.innerHTML = `TIME: ${timeElapsed}s<br>MOVES: ${moveCount}<br>SCORE: ${score}`;
        }
        
        setTimeout(() => {
            successMessage.classList.remove('hidden');
        }, 800);
    }
});
