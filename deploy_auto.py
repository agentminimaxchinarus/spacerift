#!/usr/bin/env python3
"""
SpaceRift GitHub Pages Auto-Deploy Script
Автоматизированный скрипт для создания репозитория и развертывания
"""

import os
import sys
import subprocess
import requests
import json
from pathlib import Path

class GitHubDeployer:
    def __init__(self):
        self.repo_name = "spacerift"
        self.repo_url = None
        self.github_pages_url = None
        
    def run_git_command(self, command):
        """Выполнить git команду и вернуть результат"""
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd="/workspace/github-pages")
            return result.returncode == 0, result.stdout, result.stderr
        except Exception as e:
            return False, "", str(e)
    
    def check_git_repo(self):
        """Проверить, что мы в git репозитории"""
        success, stdout, stderr = self.run_git_command("git status")
        return success
    
    def create_github_repo_api(self, username, token=None):
        """Создать репозиторий через GitHub API"""
        print(f"🌐 Создание репозитория через GitHub API...")
        
        # Данные для создания репозитория
        repo_data = {
            "name": self.repo_name,
            "description": "SpaceRift 3D Space RPG game for Telegram Mini App",
            "private": False,
            "has_issues": True,
            "has_projects": True,
            "has_wiki": True
        }
        
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }
        
        if token:
            headers["Authorization"] = f"token {token}"
        else:
            print("❌ Для создания репозитория нужен Personal Access Token")
            print("📋 Создайте токен на: https://github.com/settings/tokens")
            print("   Выберите scopes: repo, user")
            return False
        
        try:
            response = requests.post(
                "https://api.github.com/user/repos",
                headers=headers,
                json=repo_data,
                timeout=30
            )
            
            if response.status_code == 201:
                repo_info = response.json()
                self.repo_url = repo_info["clone_url"]
                self.github_pages_url = f"https://{username}.github.io/{self.repo_name}"
                print(f"✅ Репозиторий создан успешно!")
                print(f"🔗 URL: {repo_info['html_url']}")
                return True
            else:
                print(f"❌ Ошибка создания репозитория: {response.status_code}")
                print(f"📄 Ответ: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Ошибка сети: {e}")
            return False
        except Exception as e:
            print(f"❌ Неожиданная ошибка: {e}")
            return False
    
    def setup_remote(self, username):
        """Настроить remote origin"""
        if not self.repo_url:
            # Используем стандартный URL если не получили от API
            self.repo_url = f"https://github.com/{username}/{self.repo_name}.git"
            self.github_pages_url = f"https://{username}.github.io/{self.repo_name}"
        
        success, stdout, stderr = self.run_git_command(f"git remote add origin {self.repo_url}")
        if not success:
            # Remote уже существует, попробуем обновить
            success, stdout, stderr = self.run_git_command(f"git remote set-url origin {self.repo_url}")
            
        return success
    
    def push_to_github(self):
        """Push код в GitHub"""
        print("📤 Отправка кода в GitHub...")
        success, stdout, stderr = self.run_git_command("git push -u origin main")
        
        if success:
            print("✅ Код успешно отправлен!")
            return True
        else:
            print(f"❌ Ошибка при push: {stderr}")
            return False
    
    def enable_github_pages(self, username, token=None):
        """Включить GitHub Pages через API"""
        if not token:
            print("⚠️  GitHub Pages нужно включить вручную:")
            print(f"   https://github.com/{username}/{self.repo_name}/settings/pages")
            return False
            
        print("🔧 Включение GitHub Pages...")
        
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {token}"
        }
        
        pages_data = {
            "source": {
                "branch": "main",
                "path": "/"
            }
        }
        
        try:
            response = requests.post(
                f"https://api.github.com/repos/{username}/{self.repo_name}/pages",
                headers=headers,
                json=pages_data,
                timeout=30
            )
            
            if response.status_code == 201:
                print("✅ GitHub Pages активирован!")
                return True
            else:
                print(f"❌ Ошибка активации Pages: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            return False
    
    def deploy(self):
        """Основной процесс развертывания"""
        print("🚀 SpaceRift GitHub Pages Auto-Deploy")
        print("=" * 50)
        
        # Проверка git репозитория
        if not self.check_git_repo():
            print("❌ Ошибка: не найден git репозиторий")
            print("   Запустите из директории /workspace/github-pages/")
            return False
        
        print("✅ Git репозиторий найден")
        
        # Запрос данных пользователя
        username = input("🔹 Введите ваше имя пользователя GitHub: ").strip()
        if not username:
            print("❌ Имя пользователя не может быть пустым")
            return False
        
        # Опционально: запрос Personal Access Token
        token = input("🔐 Введите Personal Access Token (опционально): ").strip()
        
        print(f"\n📋 Конфигурация:")
        print(f"   Username: {username}")
        print(f"   Repository: {self.repo_name}")
        print(f"   Token: {'✅ Задан' if token else '❌ Не задан'}")
        
        # Создание репозитория
        if token:
            if not self.create_github_repo_api(username, token):
                print("\n💡 Создайте репозиторий вручную:")
                print(f"   https://github.com/new")
                print(f"   Name: {self.repo_name}")
                print(f"   Public: ✓")
                input("   Нажмите Enter после создания репозитория...")
        else:
            print(f"\n💡 Создайте репозиторий:")
            print(f"   https://github.com/new")
            print(f"   Name: {self.repo_name}")
            print(f"   Public: ✓")
            input("   Нажмите Enter после создания репозитория...")
        
        # Настройка remote
        if not self.setup_remote(username):
            print("❌ Ошибка настройки remote")
            return False
        
        # Push кода
        if not self.push_to_github():
            return False
        
        # Включение GitHub Pages
        if token:
            self.enable_github_pages(username, token)
        
        # Итоговый результат
        print("\n🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!")
        print("=" * 50)
        print(f"🔗 Репозиторий: https://github.com/{username}/{self.repo_name}")
        print(f"🌐 GitHub Pages: https://{username}.github.io/{self.repo_name}")
        print(f"📱 Telegram URL: https://{username}.github.io/{self.repo_name}")
        print("\n⏱️  GitHub Pages активируется через 5-10 минут")
        print("🔧 При необходимости активируйте Pages вручную в настройках репозитория")
        
        return True

if __name__ == "__main__":
    deployer = GitHubDeployer()
    success = deployer.deploy()
    sys.exit(0 if success else 1)