// SpaceRift - Управление пользовательским интерфейсом

class UIManager {
    constructor() {
        this.modals = new Map();
        this.notifications = [];
        this.inventory = [];
        this.isInitialized = false;
        
        // DOM элементы
        this.elements = {
            loadingScreen: null,
            gameContainer: null,
            mainMenu: null,
            shopModal: null,
            inventory: null,
            hud: null,
            controls: null,
            minimap: null
        };
        
        this.init();
    }
    
    init() {
        console.log('🖥️ Инициализация UI Manager...');
        
        this.cacheElements();
        this.setupModals();
        this.setupInventory();
        this.setupMinimap();
        this.setupAnimations();
        
        this.isInitialized = true;
        console.log('✅ UI Manager готов');
    }
    
    cacheElements() {
        // Кэширование основных DOM элементов
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            gameContainer: document.getElementById('game-container'),
            mainMenu: document.getElementById('main-menu'),
            shopModal: document.getElementById('shop-modal'),
            inventory: document.getElementById('inventory'),
            hud: document.getElementById('hud'),
            controls: document.getElementById('controls'),
            minimap: document.getElementById('minimap'),
            minimapCanvas: document.getElementById('minimap-canvas')
        };
        
        console.log('✓ DOM элементы кэшированы');
    }
    
    setupModals() {
        // Настройка модальных окон
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        console.log('✓ Модальные окна настроены');
    }
    
    setupInventory() {
        // Создание слотов инвентаря
        const inventorySlots = document.getElementById('inventory-slots');
        
        if (inventorySlots) {
            for (let i = 0; i < 30; i++) {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.dataset.slot = i;
                
                // Обработчик клика по слоту
                slot.addEventListener('click', () => this.onInventorySlotClick(i));
                
                inventorySlots.appendChild(slot);
            }
        }
        
        console.log('✓ Инвентарь настроен');
    }
    
    setupMinimap() {
        // Настройка мини-карты
        if (this.elements.minimapCanvas) {
            const canvas = this.elements.minimapCanvas;
            canvas.width = 200;
            canvas.height = 200;
            this.minimapContext = canvas.getContext('2d');
        }
        
        console.log('✓ Мини-карта настроена');
    }
    
    setupAnimations() {
        // Настройка CSS анимаций
        this.addCSSAnimations();
        
        console.log('✓ Анимации настроены');
    }
    
    addCSSAnimations() {
        // Добавление дополнительных CSS анимаций
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInFromLeft {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideInFromRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideInFromBottom {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .animate-slide-in-left {
                animation: slideInFromLeft 0.5s ease-out;
            }
            
            .animate-slide-in-right {
                animation: slideInFromRight 0.5s ease-out;
            }
            
            .animate-slide-in-bottom {
                animation: slideInFromBottom 0.5s ease-out;
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Управление модальными окнами
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('fade-in');
            this.modals.set(modalId, true);
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('fade-in');
            this.modals.delete(modalId);
        }
    }
    
    closeAllModals() {
        this.modals.forEach((value, key) => {
            this.closeModal(key);
        });
    }
    
    // Управление уведомлениями
    showNotification(title, message, type = 'info', duration = 3000) {
        const notification = this.createNotification(title, message, type);
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Автоматическое удаление
        setTimeout(() => {
            this.hideNotification(notification);
        }, duration);
        
        this.notifications.push(notification);
    }
    
    createNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">${icon}</span>
                <h3>${title}</h3>
                <button class="notification-close">&times;</button>
            </div>
            <p>${message}</p>
        `;
        
        // Обработчик закрытия
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        return notification;
    }
    
    getNotificationIcon(type) {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        return icons[type] || icons['info'];
    }
    
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
        
        // Удаление из массива
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    }
    
    // Управление инвентарем
    addToInventory(item) {
        if (this.inventory.length >= 30) {
            this.showNotification('Инвентарь полон', 'Нет свободных слотов', 'warning');
            return false;
        }
        
        this.inventory.push(item);
        this.updateInventoryDisplay();
        return true;
    }
    
    removeFromInventory(slotIndex) {
        if (slotIndex >= 0 && slotIndex < this.inventory.length) {
            const item = this.inventory.splice(slotIndex, 1)[0];
            this.updateInventoryDisplay();
            return item;
        }
        return null;
    }
    
    updateInventoryDisplay() {
        const slots = document.querySelectorAll('.inventory-slot');
        
        slots.forEach((slot, index) => {
            slot.classList.remove('filled');
            slot.innerHTML = '';
            
            if (index < this.inventory.length) {
                const item = this.inventory[index];
                slot.classList.add('filled');
                slot.innerHTML = `
                    <div class="item-icon" style="background-color: ${item.color}">
                        ${item.icon}
                    </div>
                `;
                slot.title = `${item.name} (${item.type})`;
            }
        });
    }
    
    onInventorySlotClick(slotIndex) {
        if (slotIndex < this.inventory.length) {
            const item = this.inventory[slotIndex];
            this.showItemInfo(item);
        } else {
            this.showNotification('Пустой слот', 'Этот слот пуст', 'info');
        }
    }
    
    showItemInfo(item) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${item.name}</h2>
                <div class="item-icon-large" style="background-color: ${item.color}">
                    ${item.icon}
                </div>
                <p><strong>Тип:</strong> ${item.type}</p>
                <p><strong>Описание:</strong> ${item.description}</p>
                ${item.stats ? `<p><strong>Характеристики:</strong></p><ul>${this.formatStats(item.stats)}</ul>` : ''}
                <button class="close-btn" onclick="this.closest('.modal').remove()">Закрыть</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 100);
    }
    
    formatStats(stats) {
        return Object.entries(stats)
            .map(([key, value]) => `<li>${this.translateStat(key)}: ${value}</li>`)
            .join('');
    }
    
    translateStat(stat) {
        const translations = {
            'damage': 'Урон',
            'defense': 'Защита',
            'speed': 'Скорость',
            'energy': 'Энергия'
        };
        return translations[stat] || stat;
    }
    
    // Управление мини-картой
    updateMinimap(playerPos, enemies, asteroids) {
        if (!this.minimapContext) return;
        
        const ctx = this.minimapContext;
        const canvas = this.elements.minimapCanvas;
        
        // Очистка мини-карты
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Настройка масштабирования
        const scale = 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Рисование границ мини-карты
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Рисование игрока
        if (playerPos) {
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(centerX - 2, centerY - 2, 4, 4);
        }
        
        // Рисование врагов
        ctx.fillStyle = '#ff4444';
        enemies.forEach(enemy => {
            const x = centerX + (enemy.x - playerPos.x) * scale;
            const y = centerY + (enemy.y - playerPos.y) * scale;
            if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                ctx.fillRect(x - 1, y - 1, 2, 2);
            }
        });
        
        // Рисование астероидов
        ctx.fillStyle = '#888888';
        asteroids.forEach(asteroid => {
            const x = centerX + (asteroid.x - playerPos.x) * scale;
            const y = centerY + (asteroid.y - playerPos.y) * scale;
            if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
            }
        });
    }
    
    // Обновление HUD
    updateHUD(stats) {
        if (!stats) return;
        
        // Обновление текстовых значений
        this.updateElement('level', stats.level);
        this.updateElement('experience', `${stats.experience}/${stats.experienceToNext}`);
        this.updateElement('credits', stats.credits);
        this.updateElement('energy', `${stats.energy}/${stats.maxEnergy}`);
        
        // Обновление прогресс-баров
        this.updateProgressBar('energy-bar', stats.energy, stats.maxEnergy);
        this.updateProgressBar('experience-bar', stats.experience, stats.experienceToNext);
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateProgressBar(id, value, max) {
        const bar = document.getElementById(id);
        if (bar) {
            const percentage = (value / max) * 100;
            bar.style.width = percentage + '%';
        }
    }
    
    // Анимации
    showScreen(screenId) {
        // Скрытие всех экранов
        const screens = ['main-menu', 'game-container', 'shop-modal', 'inventory'];
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        // Показ нужного экрана
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            targetScreen.classList.add('fade-in');
        }
    }
    
    // Эффекты
    addScreenShake(intensity = 5, duration = 300) {
        const container = this.elements.gameContainer;
        if (!container) return;
        
        const originalTransform = container.style.transform;
        
        const shake = setInterval(() => {
            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            container.style.transform = `translate(${x}px, ${y}px)`;
        }, 50);
        
        setTimeout(() => {
            clearInterval(shake);
            container.style.transform = originalTransform;
        }, duration);
    }
    
    flashScreen(color = '#ff0000', duration = 200) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            pointer-events: none;
            z-index: 9999;
            opacity: 0.3;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
        }, duration);
    }
    
    // Полезные утилиты
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Создание примерных предметов для тестирования
    createTestItems() {
        const testItems = [
            {
                name: 'Лазерная пушка',
                type: 'Оружие',
                icon: '🔫',
                color: '#ff6b6b',
                description: 'Мощное оружие для уничтожения врагов',
                stats: { damage: '+25%', energy: '-10%' }
            },
            {
                name: 'Улучшенный корпус',
                type: 'Защита',
                icon: '🛡️',
                color: '#4ecdc4',
                description: 'Повышает защиту корабля',
                stats: { defense: '+20%', speed: '-5%' }
            },
            {
                name: 'Ускоритель двигателя',
                type: 'Двигатель',
                icon: '⚡',
                color: '#f9ca24',
                description: 'Увеличивает скорость корабля',
                stats: { speed: '+15%', energy: '+5%' }
            }
        ];
        
        return testItems;
    }
}

// Создание глобального экземпляра UI Manager
window.uiManager = new UIManager();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}