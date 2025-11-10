#!/bin/bash
# Проверка работы SpaceRift на GitHub Pages

echo "🌌 Проверка SpaceRift на GitHub Pages..."
echo

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL сайта
SITE_URL="https://agentminimaxchinarus.github.io/spacerift"

echo "🔍 Проверяем доступность сайта..."
echo "URL: $SITE_URL"
echo

# Проверка HTTP статуса
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $SITE_URL)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Сайт доступен (HTTP $HTTP_STATUS)${NC}"
    
    # Проверка содержимого
    echo "🔍 Проверяем содержимое..."
    CONTENT=$(curl -s $SITE_URL)
    
    if [[ $CONTENT == *"SpaceRift"* ]]; then
        echo -e "${GREEN}✅ Найден заголовок SpaceRift${NC}"
    else
        echo -e "${YELLOW}⚠️ Заголовок SpaceRift не найден${NC}"
    fi
    
    if [[ $CONTENT == *"game-container"* ]]; then
        echo -e "${GREEN}✅ Найден игровой контейнер${NC}"
    else
        echo -e "${RED}❌ Игровой контейнер не найден${NC}"
    fi
    
    if [[ $CONTENT == *"scripts/main.js"* ]]; then
        echo -e "${GREEN}✅ Найден main.js${NC}"
    else
        echo -e "${RED}❌ main.js не найден${NC}"
    fi
    
    if [[ $CONTENT == *"scripts/game.js"* ]]; then
        echo -e "${GREEN}✅ Найден game.js${NC}"
    else
        echo -e "${RED}❌ game.js не найден${NC}"
    fi
    
    echo
    echo -e "${GREEN}🎮 Сайт готов для @BotFather!${NC}"
    echo "📱 URL для Mini App: $SITE_URL"
    
else
    echo -e "${RED}❌ Сайт недоступен (HTTP $HTTP_STATUS)${NC}"
    echo
    echo "🚀 Решения:"
    echo "1. Проверьте активацию GitHub Pages:"
    echo "   https://github.com/agentminimaxchinarus/spacerift/settings/pages"
    echo
    echo "2. Убедитесь, что настройки:"
    echo "   • Source: Deploy from a branch"
    echo "   • Branch: main"
    echo "   • Folder: / (root)"
    echo
    echo "3. Подождите 3-5 минут после активации"
    echo
    echo "4. Очистите кэш браузера (Ctrl+F5)"
fi

echo
echo "📊 Подробная информация:"
curl -I $SITE_URL 2>/dev/null | head -1

echo
echo "🌐 Откройте в браузере: $SITE_URL"
