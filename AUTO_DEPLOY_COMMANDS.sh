#!/bin/bash

# SpaceRift Auto-Deploy Command File
# Скопируйте и выполните команды по порядку

echo "🚀 SpaceRift Auto-Deploy Commands"
echo "================================="

# 1. Переход в директорию
echo "1. Переход в директорию проекта..."
cd /workspace/github-pages

# 2. Проверка файлов
echo "2. Проверка файлов..."
ls -la
echo ""

# 3. Добавление remote origin
echo "3. Настройка remote origin..."
GIT_REMOTE_URL="https://github.com/agentminimaxchinarus/spacerift.git"

# Удаляем старый remote если есть
git remote remove origin 2>/dev/null || true

# Добавляем новый remote
git remote add origin "$GIT_REMOTE_URL"

# Проверяем remote
git remote -v
echo ""

# 4. Push в репозиторий
echo "4. Push в GitHub репозиторий..."
echo "   Remote URL: $GIT_REMOTE_URL"
echo "   (Вам потребуется GitHub credentials)"
echo ""

# Выполняем push
git push -u origin main

# Проверяем результат
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 УСПЕШНО! Развертывание завершено"
    echo ""
    echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
    echo "1. Откройте: https://github.com/agentminimaxchinarus/spacerift"
    echo "2. Settings → Pages"
    echo "3. Source: 'Deploy from a branch'"
    echo "4. Branch: main"
    echo "5. Folder: / (root)"
    echo "6. Save"
    echo ""
    echo "🌐 Ваш URL для Telegram Mini App:"
    echo "   https://agentminimaxchinarus.github.io/spacerift"
    echo ""
    echo "⏱️  GitHub Pages активируется через 5-10 минут"
else
    echo ""
    echo "❌ Ошибка при push в GitHub"
    echo ""
    echo "💡 Решения:"
    echo "   • Убедитесь, что репозиторий создан и публичный"
    echo "   • Используйте Personal Access Token вместо пароля"
    echo "   • Проверьте настройки доступа"
    echo ""
    echo "🔗 Создайте репозиторий вручную:"
    echo "   https://github.com/new"
    echo "   Name: spacerift"
    echo "   Public: ✓"
fi