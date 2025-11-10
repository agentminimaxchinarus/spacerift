// SpaceRift - Основной файл инициализации игры

class SpaceRift {
    constructor() {
        this.game = null;
        this.telegram = null;
        this.user = null;
        this.isInitialized = false;
        this.isLoading = true;
        
        // Игровые состояния
        this.gameState = 'loading'; // loading, menu, playing, paused
        this.currentScreen = 'loading';
        
        // Статистика игрока
        this.playerStats = {
            level: 1,
            experience: 0,
            experienceToNext: 100,
            credits: 1000,
            energy: 100,
            maxEnergy: 100,
            health: 100,
            maxHealth: 100,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        };
        
        // Настройки управления
        this.controls = {
            thrust: false,
            brake: false,
            left: false,
            right: false,
            shoot: false
        };
        
        // Инициализация отложена до DOMContentLoaded
    }
    
    async init() {
        console.log('🚀 SpaceRift инициализация...');
        
        try {
            // Проверка загрузки THREE.js
            if (typeof THREE === 'undefined') {
                throw new Error('THREE.js не загружен');
            }
            
            // Проверка доступности GameEngine
            if (typeof GameEngine === 'undefined') {
                throw new Error('GameEngine не загружен. Проверьте порядок загрузки скриптов.');
            }
            
            // Инициализация Telegram WebApp
            await this.initTelegram();
            
            // Инициализация загрузочного экрана
            this.initLoadingScreen();
            
            // Загрузка ресурсов
            await this.loadResources();
            
            // Инициализация игрового движка
            await this.initGame();
            
            // Инициализация UI
            this.initUI();
            
            // Инициализация управления
            this.initControls();
            
            // Запуск игрового цикла
            this.startGameLoop();
            
            this.isInitialized = true;
            this.gameState = 'menu';
            this.showMainMenu();
            
            console.log('✅ SpaceRift готов к запуску!');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации SpaceRift:', error);
            
            // Скрыть загрузочный экран
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Показать ошибку
            this.showError('Ошибка инициализации игры: ' + error.message + '. Пожалуйста, перезагрузите страницу.');
        }
    }
    
    async initTelegram() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.telegram = Telegram.WebApp;
            
            // Настройка темы
            this.telegram.setHeaderColor('#000000');
            this.telegram.setBackgroundColor('#000000');
            
            // Получение данных пользователя
            if (this.telegram.initDataUnsafe && this.telegram.initDataUnsafe.user) {
                this.user = this.telegram.initDataUnsafe.user;
                console.log('👤 Пользователь Telegram:', this.user);
            }
            
            // Обработка кнопки "Назад"
            this.telegram.BackButton.hide();
            this.telegram.BackButton.onClick(() => {
                this.telegram.close();
            });
            
            // Готовность к отображению
            this.telegram.ready();
        } else {
            console.warn('⚠️ Telegram WebApp не найден, работаем в браузере');
        }
    }
    
    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressFill = document.querySelector('.progress-fill');
        
        // Симуляция загрузки с прогрессом
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Завершение загрузки
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
            
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
        }, 200);
    }
    
    async loadResources() {
        console.log('📦 Загрузка ресурсов...');
        
        // Симуляция загрузки ресурсов
        const resources = [
            'Модели кораблей',
            'Текстуры космоса',
            'Звуковые эффекты',
            'Спрайты интерфейса',
            'Настройки игры'
        ];
        
        for (let i = 0; i < resources.length; i++) {
            await this.delay(300);
            console.log(`✓ Загружен: ${resources[i]}`);
        }
        
        console.log('✅ Все ресурсы загружены');
    }
    
    async initGame() {
        console.log('🎮 Инициализация игрового движка...');
        
        // Создание игрового движка
        this.game = new GameEngine();
        
        // Инициализация THREE.js
        await this.game.init();
        
        console.log('✅ Игровой движок инициализирован');
    }
    
    initUI() {
        console.log('🖥️ Инициализация пользовательского интерфейса...');
        
        // Обработчики кнопок меню
        const startGameBtn = document.getElementById('start-game');
        const openInventoryBtn = document.getElementById('open-inventory');
        const openShopBtn = document.getElementById('open-shop');
        const openStatsBtn = document.getElementById('open-stats');
        const closeShopBtn = document.getElementById('close-shop');
        
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startGame());
        }
        
        if (openInventoryBtn) {
            openInventoryBtn.addEventListener('click', () => this.showInventory());
        }
        
        if (openShopBtn) {
            openShopBtn.addEventListener('click', () => this.showShop());
        }
        
        if (openStatsBtn) {
            openStatsBtn.addEventListener('click', () => this.showStats());
        }
        
        if (closeShopBtn) {
            closeShopBtn.addEventListener('click', () => this.hideShop());
        }
        
        // Обработчики магазина
        const buyButtons = document.querySelectorAll('.buy-btn');
        buyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.shop-item').dataset.item;
                this.buyItem(item);
            });
        });
        
        console.log('✅ UI инициализирован');
    }
    
    initControls() {
        console.log('🎮 Инициализация управления...');
        
        // Клавиатурное управление
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Сенсорное управление
        const controlButtons = {
            'thrust-btn': 'thrust',
            'brake-btn': 'brake',
            'left-btn': 'left',
            'right-btn': 'right',
            'shoot-btn': 'shoot'
        };
        
        for (const [btnId, controlName] of Object.entries(controlButtons)) {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('mousedown', () => this.setControl(controlName, true));
                btn.addEventListener('mouseup', () => this.setControl(controlName, false));
                btn.addEventListener('mouseleave', () => this.setControl(controlName, false));
                
                // Сенсорная поддержка
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.setControl(controlName, true);
                });
                btn.addEventListener('touchend', () => this.setControl(controlName, false));
            }
        }
        
        console.log('✅ Управление инициализировано');
    }
    
    onKeyDown(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.controls.thrust = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.controls.brake = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.controls.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.controls.right = true;
                break;
            case 'Space':
                e.preventDefault();
                this.controls.shoot = true;
                break;
            case 'Escape':
                this.togglePause();
                break;
        }
    }
    
    onKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.controls.thrust = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.controls.brake = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.controls.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.controls.right = false;
                break;
            case 'Space':
                this.controls.shoot = false;
                break;
        }
    }
    
    setControl(controlName, pressed) {
        this.controls[controlName] = pressed;
    }
    
    startGameLoop() {
        console.log('🔄 Запуск игрового цикла...');
        
        const gameLoop = () => {
            if (this.isInitialized) {
                this.update();
                this.render();
            }
            requestAnimationFrame(gameLoop);
        };
        
        gameLoop();
        console.log('✅ Игровой цикл запущен');
    }
    
    update() {
        if (this.gameState === 'playing') {
            // Обновление игрового состояния
            this.updatePlayer();
            this.updateUI();
            this.handleCollisions();
            this.updateGameWorld();
        }
    }
    
    updatePlayer() {
        // Обновление позиции и состояния игрока
        if (this.game) {
            this.game.updatePlayer(this.controls, this.playerStats);
        }
    }
    
    updateUI() {
        // Обновление интерфейса
        document.getElementById('level').textContent = this.playerStats.level;
        document.getElementById('experience').textContent = 
            `${this.playerStats.experience}/${this.playerStats.experienceToNext}`;
        document.getElementById('credits').textContent = this.playerStats.credits;
        document.getElementById('energy').textContent = 
            `${this.playerStats.energy}/${this.playerStats.maxEnergy}`;
    }
    
    handleCollisions() {
        // Обработка столкновений
        if (this.game) {
            this.game.handleCollisions();
        }
    }
    
    updateGameWorld() {
        // Обновление игрового мира
        if (this.game) {
            this.game.update();
        }
    }
    
    render() {
        if (this.game && this.gameState === 'playing') {
            this.game.render();
        }
    }
    
    showMainMenu() {
        this.currentScreen = 'main-menu';
        this.hideAllScreens();
        document.getElementById('main-menu').style.display = 'flex';
    }
    
    startGame() {
        console.log('🎮 Начало игры...');
        this.gameState = 'playing';
        this.currentScreen = 'game';
        this.hideAllScreens();
        document.getElementById('game-container').style.display = 'block';
    }
    
    showInventory() {
        const inventory = document.getElementById('inventory');
        if (inventory) {
            inventory.style.display = 'block';
        }
    }
    
    showShop() {
        document.getElementById('shop-modal').style.display = 'flex';
    }
    
    hideShop() {
        document.getElementById('shop-modal').style.display = 'none';
    }
    
    showStats() {
        this.showNotification('Статистика', 'Здесь будет отображаться статистика игрока');
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showNotification('Игра приостановлена', 'Нажмите ESC для продолжения');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    buyItem(itemId) {
        const items = {
            'ship_hull_1': { price: 500, name: 'Улучшенный корпус Mk I' },
            'weapon_laser_1': { price: 750, name: 'Лазерная пушка Mk I' },
            'engine_boost_1': { price: 400, name: 'Ускоритель двигателя' }
        };
        
        const item = items[itemId];
        if (!item) return;
        
        if (this.playerStats.credits >= item.price) {
            this.playerStats.credits -= item.price;
            this.updateUI();
            this.showNotification('Покупка успешна', `Куплен: ${item.name}`);
        } else {
            this.showNotification('Недостаточно кредитов', `Нужно: ${item.price}, у вас: ${this.playerStats.credits}`);
        }
    }
    
    showNotification(title, message) {
        try {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="btn">OK</button>
            `;
            
            // Правильная обработка события закрытия
            const closeBtn = notification.querySelector('.btn');
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 3000);
        } catch (error) {
            console.error('Ошибка при создании уведомления:', error);
            alert(`${title}: ${message}`);
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        this.isLoading = false;
    }
    
    hideAllScreens() {
        // Скрытие всех экранов
        const screens = ['main-menu', 'shop-modal', 'inventory'];
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) {
                element.style.display = 'none';
            }
        });
    }
    
    showError(message) {
        this.showNotification('Ошибка', message);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Публичный метод для запуска инициализации
    async start() {
        await this.init();
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpaceRift;
}