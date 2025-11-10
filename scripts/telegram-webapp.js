// SpaceRift - Telegram WebApp интеграция

class TelegramWebApp {
    constructor() {
        this.tg = null;
        this.isReady = false;
        this.user = null;
        this.initData = null;
        this.themeParams = {};
        this.isInTelegram = false;
        
        this.init();
    }
    
    init() {
        console.log('📱 Инициализация Telegram WebApp...');
        
        // Проверка наличия Telegram WebApp API
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            this.tg = Telegram.WebApp;
            this.isInTelegram = true;
            
            this.setupWebApp();
            this.setupTheme();
            this.setupUser();
            this.setupButtons();
            this.setupEvents();
            
            this.isReady = true;
            console.log('✅ Telegram WebApp готов');
        } else {
            console.warn('⚠️ Telegram WebApp не найден, работаем в браузере');
            this.setupBrowserMode();
        }
    }
    
    setupWebApp() {
        // Основные настройки WebApp
        if (this.tg) {
            // Готовность к отображению
            this.tg.ready();
            
            // Запрос разрешений (если необходимо)
            // this.tg.requestWriteAccess((access) => {
            //     console.log('Write access:', access);
            // });
        }
    }
    
    setupTheme() {
        if (!this.tg) return;
        
        // Получение параметров темы
        this.themeParams = this.tg.themeParams || {};
        
        // Применение темы
        this.applyTelegramTheme();
        
        // Обработка изменения темы
        if (this.tg.onEvent) {
            this.tg.onEvent('themeChanged', () => {
                this.themeParams = this.tg.themeParams || {};
                this.applyTelegramTheme();
            });
        }
    }
    
    applyTelegramTheme() {
        const root = document.documentElement;
        
        // Основные цвета темы
        const bgColor = this.themeParams.bg_color || '#ffffff';
        const textColor = this.themeParams.text_color || '#000000';
        const hintColor = this.themeParams.hint_color || '#999999';
        const linkColor = this.themeParams.link_color || '#3390ec';
        const buttonColor = this.themeParams.button_color || this.themeParams.bg_color || '#3390ec';
        const buttonTextColor = this.themeParams.button_text_color || '#ffffff';
        
        // Применение CSS переменных
        root.style.setProperty('--tg-theme-bg-color', bgColor);
        root.style.setProperty('--tg-theme-text-color', textColor);
        root.style.setProperty('--tg-theme-hint-color', hintColor);
        root.style.setProperty('--tg-theme-link-color', linkColor);
        root.style.setProperty('--tg-theme-button-color', buttonColor);
        root.style.setProperty('--tg-theme-button-text-color', buttonTextColor);
        
        // Обновление тела документа
        if (bgColor !== '#ffffff') {
            document.body.style.backgroundColor = bgColor;
        }
        
        if (textColor !== '#000000') {
            document.body.style.color = textColor;
        }
    }
    
    setupUser() {
        if (!this.tg) return;
        
        // Получение данных пользователя
        if (this.tg.initDataUnsafe && this.tg.initDataUnsafe.user) {
            this.user = this.tg.initDataUnsafe.user;
            this.initData = this.tg.initDataUnsafe;
            
            console.log('👤 Пользователь Telegram:', this.user);
            
            // Сохранение данных пользователя в локальном хранилище
            this.saveUserData();
        }
    }
    
    saveUserData() {
        if (this.user) {
            localStorage.setItem('spaceRift_user', JSON.stringify(this.user));
        }
    }
    
    loadUserData() {
        const saved = localStorage.getItem('spaceRift_user');
        return saved ? JSON.parse(saved) : null;
    }
    
    setupButtons() {
        if (!this.tg) return;
        
        // Настройка основной кнопки
        this.tg.MainButton.hide();
        
        // Настройка кнопки "Назад"
        this.tg.BackButton.hide();
        this.tg.BackButton.onClick(() => {
            this.tg.close();
        });
        
        // Настройка кнопки расширения
        this.tg.expand();
    }
    
    setupEvents() {
        if (!this.tg) return;
        
        // Обработка видимости приложения
        if (this.tg.onEvent) {
            this.tg.onEvent('viewportChanged', (data) => {
                console.log('Viewport changed:', data);
                this.handleViewportChange(data);
            });
            
            this.tg.onEvent('popupClosed', (data) => {
                console.log('Popup closed:', data);
                this.handlePopupClosed(data);
            });
        }
    }
    
    handleViewportChange(data) {
        // Обработка изменения размера окна
        const { height, width, is_expanded } = data;
        
        // Обновление размеров игрового контейнера
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.height = height + 'px';
            gameContainer.style.width = width + 'px';
        }
    }
    
    handlePopupClosed(data) {
        // Обработка закрытия всплывающего окна
        console.log('Popup closed:', data);
    }
    
    setupBrowserMode() {
        // Настройки для работы в обычном браузере
        console.log('🌐 Настройка режима браузера...');
        
        // Создание заглушки для Telegram API
        this.createTelegramStub();
    }
    
    createTelegramStub() {
        // Создание заглушки для работы вне Telegram
        window.Telegram = {
            WebApp: {
                ready: () => console.log('WebApp ready (stub)'),
                MainButton: {
                    show: () => console.log('MainButton show (stub)'),
                    hide: () => console.log('MainButton hide (stub)'),
                    setText: (text) => console.log('MainButton setText:', text, '(stub)'),
                    onClick: (callback) => console.log('MainButton onClick registered (stub)'),
                    offClick: (callback) => console.log('MainButton offClick (stub)'),
                    enable: () => console.log('MainButton enable (stub)'),
                    disable: () => console.log('MainButton disable (stub)'),
                    showProgress: (leaveActive) => console.log('MainButton showProgress (stub)'),
                    hideProgress: () => console.log('MainButton hideProgress (stub)')
                },
                BackButton: {
                    show: () => console.log('BackButton show (stub)'),
                    hide: () => console.log('BackButton hide (stub)'),
                    onClick: (callback) => console.log('BackButton onClick registered (stub)'),
                    offClick: (callback) => console.log('BackButton offClick (stub)')
                },
                expand: () => console.log('WebApp expand (stub)'),
                close: () => {
                    if (confirm('Закрыть игру?')) {
                        window.close();
                    }
                },
                setHeaderColor: (color) => console.log('Header color set:', color, '(stub)'),
                setBackgroundColor: (color) => console.log('Background color set:', color, '(stub)'),
                initData: '',
                initDataUnsafe: {
                    user: {
                        id: 12345,
                        first_name: 'Test',
                        last_name: 'User',
                        username: 'test_user',
                        language_code: 'ru',
                        is_premium: false
                    },
                    chat_type: '',
                    chat_instance: '',
                    start_param: '',
                    can_send_after: 0
                },
                version: '6.0',
                platform: 'web',
                colorScheme: 'light',
                themeParams: {
                    bg_color: '#ffffff',
                    text_color: '#000000',
                    hint_color: '#999999',
                    link_color: '#3390ec',
                    button_color: '#3390ec',
                    button_text_color: '#ffffff'
                },
                isExpanded: true,
                viewportHeight: window.innerHeight,
                viewportStableHeight: window.innerHeight,
                headerColor: '#000000',
                backgroundColor: '#000000',
                onEvent: (event, callback) => console.log('Event registered:', event, '(stub)'),
                offEvent: (event, callback) => console.log('Event unregistered:', event, '(stub)'),
                sendData: (data) => console.log('Data sent:', data, '(stub)'),
                openLink: (url, options) => {
                    console.log('Open link:', url, '(stub)');
                    window.open(url, '_blank');
                },
                openTelegramLink: (url) => {
                    console.log('Open Telegram link:', url, '(stub)');
                    window.open('https://t.me' + url, '_blank');
                },
                openInvoice: (url, callback) => {
                    console.log('Open invoice:', url, '(stub)');
                    if (callback) callback({ status: 'cancelled' });
                },
                showPopup: (params, callback) => {
                    console.log('Show popup:', params, '(stub)');
                    if (callback) callback({ button_id: 1 });
                },
                showAlert: (message, callback) => {
                    alert(message);
                    if (callback) callback();
                },
                showConfirm: (message, callback) => {
                    const result = confirm(message);
                    if (callback) callback({ is_confirmed: result });
                },
                showScanQrPopup: (params, callback) => {
                    console.log('Show scan QR popup (stub)');
                    if (callback) callback({ data: 'stub_qr_data' });
                },
                closeScanQrPopup: () => console.log('Close scan QR popup (stub)'),
                readTextFromClipboard: (callback) => {
                    console.log('Read from clipboard (stub)');
                    if (callback) callback({ data: 'stub_clipboard_text' });
                },
                requestWriteAccess: (callback) => {
                    console.log('Request write access (stub)');
                    if (callback) callback({ status: 'granted' });
                },
                requestContact: (contact, callback) => {
                    console.log('Request contact:', contact, '(stub)');
                    if (callback) callback({ status: 'cancelled' });
                },
                switchInlineQuery: (query, choose_chat_types) => {
                    console.log('Switch inline query:', query, choose_chat_types, '(stub)');
                }
            }
        };
    }
    
    // Публичные методы
    
    getUser() {
        return this.user || this.loadUserData();
    }
    
    getUserId() {
        const user = this.getUser();
        return user ? user.id : null;
    }
    
    getUserName() {
        const user = this.getUser();
        if (!user) return 'Гость';
        
        return user.first_name || user.username || 'Пользователь';
    }
    
    isPremium() {
        const user = this.getUser();
        return user ? user.is_premium : false;
    }
    
    showAlert(message, callback) {
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message, callback);
        } else {
            alert(message);
            if (callback) callback();
        }
    }
    
    showConfirm(message, callback) {
        if (this.tg && this.tg.showConfirm) {
            this.tg.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            if (callback) callback({ is_confirmed: result });
        }
    }
    
    sendData(data) {
        if (this.tg && this.tg.sendData) {
            this.tg.sendData(JSON.stringify(data));
        } else {
            console.log('Send data (stub):', data);
        }
    }
    
    openLink(url) {
        if (this.tg && this.tg.openLink) {
            this.tg.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    }
    
    close() {
        if (this.tg && this.tg.close) {
            this.tg.close();
        } else {
            window.close();
        }
    }
    
    expand() {
        if (this.tg && this.tg.expand) {
            this.tg.expand();
        }
    }
    
    // Методы для интеграции с игрой
    
    saveGameProgress(progress) {
        if (this.isInTelegram) {
            this.sendData({
                type: 'save_progress',
                user_id: this.getUserId(),
                progress: progress
            });
        } else {
            // Сохранение в локальном хранилище
            localStorage.setItem('spaceRift_progress', JSON.stringify(progress));
        }
    }
    
    loadGameProgress() {
        if (this.isInTelegram) {
            this.sendData({
                type: 'load_progress',
                user_id: this.getUserId()
            });
        } else {
            // Загрузка из локального хранилища
            const saved = localStorage.getItem('spaceRift_progress');
            return saved ? JSON.parse(saved) : null;
        }
    }
    
    getLeaderboard() {
        if (this.isInTelegram) {
            this.sendData({
                type: 'get_leaderboard',
                user_id: this.getUserId()
            });
        }
    }
    
    shareScore(score) {
        const text = `🚀 Мой счет в SpaceRift: ${score}!\n\nИграй в космическую RPG: @minigamerus_bot`;
        
        if (this.tg && this.tg.switchInlineQuery) {
            this.tg.switchInlineQuery(text, ['users', 'groups', 'channels']);
        } else {
            // В браузере - копирование в буфер обмена
            navigator.clipboard.writeText(text).then(() => {
                console.log('Score copied to clipboard');
            });
        }
    }
    
    // Обработка событий игры
    
    onGameStart() {
        this.sendData({
            type: 'game_start',
            user_id: this.getUserId(),
            timestamp: Date.now()
        });
    }
    
    onGameEnd(score) {
        this.sendData({
            type: 'game_end',
            user_id: this.getUserId(),
            score: score,
            timestamp: Date.now()
        });
    }
    
    onLevelUp(level) {
        this.sendData({
            type: 'level_up',
            user_id: this.getUserId(),
            level: level,
            timestamp: Date.now()
        });
        
        // Показать поздравление
        this.showAlert(`🎉 Поздравляем! Достигнут уровень ${level}!`);
    }
    
    onPurchase(item) {
        this.sendData({
            type: 'purchase',
            user_id: this.getUserId(),
            item: item,
            timestamp: Date.now()
        });
    }
}

// Создание глобального экземпляра
window.telegramApp = new TelegramWebApp();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramWebApp;
}