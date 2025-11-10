#!/usr/bin/env python3
"""
Простое развертывание SpaceRift на GitHub
Быстрый скрипт для создания репозитория и push
"""

import os
import subprocess
import requests
import json

def main():
    print("🚀 SpaceRift GitHub Quick Deploy")
    print("=" * 40)
    
    # Проверка git репозитория
    try:
        result = subprocess.run(["git", "status"], cwd="/workspace/github-pages", capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Git репозиторий не найден")
            return False
    except Exception as e:
        print(f"❌ Ошибка git: {e}")
        return False
    
    print("✅ Git репозиторий готов")
    
    # Запрос username
    username = input("Введите ваше GitHub username: ").strip()
    if not username:
        print("❌ Username не может быть пустым")
        return False
    
    repo_name = "spacerift"
    repo_url = f"https://github.com/{username}/{repo_name}.git"
    pages_url = f"https://{username}.github.io/{repo_name}"
    
    print(f"\n📋 Настройка:")
    print(f"   Repository: {repo_url}")
    print(f"   Pages URL: {pages_url}")
    
    # Настройка remote
    try:
        subprocess.run(["git", "remote", "add", "origin", repo_url], 
                      cwd="/workspace/github-pages", check=True)
        print("✅ Remote origin добавлен")
    except subprocess.CalledProcessError:
        # Remote уже существует
        try:
            subprocess.run(["git", "remote", "set-url", "origin", repo_url], 
                          cwd="/workspace/github-pages", check=True)
            print("✅ Remote origin обновлен")
        except subprocess.CalledProcessError as e:
            print(f"❌ Ошибка настройки remote: {e}")
            return False
    
    # Push в GitHub
    try:
        print("\n📤 Отправка в GitHub...")
        result = subprocess.run(["git", "push", "-u", "origin", "main"], 
                               cwd="/workspace/github-pages", 
                               input="", text=True, capture_output=True)
        
        if result.returncode == 0:
            print("✅ Код успешно отправлен!")
        else:
            print("❌ Ошибка push:")
            print(result.stderr.decode() if result.stderr else "Unknown error")
            print(f"\n💡 Создайте репозиторий вручную:")
            print(f"   https://github.com/new")
            print(f"   Name: {repo_name}")
            print(f"   Public: ✓")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка push: {e}")
        return False
    
    # Успешное развертывание
    print("\n🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!")
    print("=" * 40)
    print(f"🔗 Repository: https://github.com/{username}/{repo_name}")
    print(f"🌐 GitHub Pages: {pages_url}")
    print(f"📱 Telegram URL: {pages_url}")
    print("\n⚡ СЛЕДУЮЩИЕ ШАГИ:")
    print("1. Откройте: https://github.com/{username}/{repo_name}/settings/pages")
    print("2. Source: 'Deploy from a branch'")
    print("3. Branch: main")
    print("4. Folder: / (root)")
    print("5. Save")
    print("\n⏱️  Pages активируется через 5-10 минут")
    
    return True

if __name__ == "__main__":
    main()