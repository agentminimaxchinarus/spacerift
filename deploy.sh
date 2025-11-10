#!/bin/bash

# SpaceRift GitHub Pages Deployment Script
# Автоматизированный скрипт для развертывания

echo "🚀 SpaceRift GitHub Pages Deployment"
echo "=================================="

# Проверка текущей директории
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Git репозиторий не найден в текущей директории"
    echo "   Запустите скрипт из директории /workspace/github-pages/"
    exit 1
fi

# Проверка файлов
if [ ! -f "index.html" ]; then
    echo "❌ Ошибка: файл index.html не найден"
    exit 1
fi

echo "✅ Git репозиторий найден"
echo "✅ Файлы проекта проверены"

# Запрос имени пользователя
echo ""
read -p "🔹 Введите ваше имя пользователя GitHub: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Ошибка: имя пользователя не может быть пустым"
    exit 1
fi

REPO_URL="https://github.com/$GITHUB_USERNAME/spacerift.git"
GITHUB_PAGES_URL="https://$GITHUB_USERNAME.github.io/spacerift"

echo ""
echo "📋 Конфигурация:"
echo "   Username: $GITHUB_USERNAME"
echo "   Repository: $REPO_URL"
echo "   GitHub Pages URL: $GITHUB_PAGES_URL"

# Добавление remote если еще не добавлен
if ! git remote | grep -q origin; then
    echo ""
    echo "🔗 Добавление remote origin..."
    git remote add origin "$REPO_URL"
    echo "✅ Remote origin добавлен"
else
    echo "✅ Remote origin уже настроен"
fi

# Push в репозиторий
echo ""
echo "📤 Push в GitHub репозиторий..."
echo "   (Вам потребуется ввести GitHub credentials или Personal Access Token)"

if git push -u origin main; then
    echo ""
    echo "🎉 УСПЕШНО! Код отправлен в GitHub"
    echo ""
    echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
    echo "1. Откройте: https://github.com/$GITHUB_USERNAME/spacerift"
    echo "2. Settings → Pages"
    echo "3. Source: 'Deploy from a branch'"
    echo "4. Branch: main"
    echo "5. Folder: / (root)"
    echo "6. Save"
    echo ""
    echo "🌐 Ваш URL для Telegram Mini App:"
    echo "   $GITHUB_PAGES_URL"
    echo ""
    echo "⏱️  GitHub Pages активируется через 5-10 минут"
else
    echo ""
    echo "❌ Ошибка при push в GitHub"
    echo ""
    echo "💡 Решения:"
    echo "   • Проверьте правильность имени пользователя: $GITHUB_USERNAME"
    echo "   • Убедитесь, что репозиторий создан и публичный"
    echo "   • Используйте Personal Access Token вместо пароля"
    echo ""
    echo "🔗 Создайте репозиторий вручную: https://github.com/new"
    echo "   Name: spacerift"
    echo "   Public: ✓"
    echo "   README: ✗ (не ставить галочку)"
fi