// SpaceRift - Игровой движок

class GameEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.gameObjects = [];
        this.stars = [];
        this.particles = [];
        this.lasers = [];
        this.enemies = [];
        this.asteroids = [];
        this.isInitialized = false;
        
        // Игровые константы
        this.PLAYER_SPEED = 0.1;
        this.PLAYER_ROTATION_SPEED = 0.05;
        this.LASER_SPEED = 2;
        this.ENEMY_SPAWN_RATE = 0.02;
        this.ASTEROID_SPAWN_RATE = 0.01;
        
        // Время
        this.lastTime = 0;
        this.elapsedTime = 0;
    }
    
    async init() {
        console.log('🎮 Инициализация игрового движка...');
        
        try {
            // Создание сцены
            this.initScene();
            
            // Создание камеры
            this.initCamera();
            
            // Создание рендерера
            this.initRenderer();
            
            // Создание освещения
            this.initLighting();
            
            // Создание игрока
            this.initPlayer();
            
            // Создание звездного поля
            this.createStarField();
            
            // Создание астероидов
            this.createAsteroids();
            
            // Настройка рендеринга
            this.setupRendering();
            
            this.isInitialized = true;
            console.log('✅ Игровой движок готов');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации игрового движка:', error);
            throw error;
        }
    }
    
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        this.scene.fog = new THREE.Fog(0x000011, 1000, 10000);
        
        // Добавление космической атмосферы
        const ambientLight = new THREE.AmbientLight(0x222222, 0.5);
        this.scene.add(ambientLight);
        
        console.log('✓ Сцена создана');
    }
    
    initCamera() {
        const canvas = document.getElementById('game-canvas');
        const aspect = canvas.clientWidth / canvas.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
        this.camera.position.set(0, 0, 10);
        
        // Настройка для вид от первого лица
        this.camera.lookAt(0, 0, 0);
        
        console.log('✓ Камера создана');
    }
    
    initRenderer() {
        const canvas = document.getElementById('game-canvas');
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false
        });
        
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        console.log('✓ Рендерер создан');
    }
    
    initLighting() {
        // Основной направленный свет
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        this.scene.add(directionalLight);
        
        // Дополнительное освещение
        const light2 = new THREE.DirectionalLight(0x00d4ff, 0.3);
        light2.position.set(-5, -5, 5);
        this.scene.add(light2);
        
        console.log('✓ Освещение настроено');
    }
    
    initPlayer() {
        // Создание корабля игрока
        const playerGeometry = new THREE.ConeGeometry(1, 3, 8);
        const playerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00d4ff,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.set(0, 0, 0);
        this.player.rotation.x = Math.PI / 2;
        this.player.castShadow = true;
        
        // Добавление деталей корабля
        this.addPlayerDetails();
        
        this.scene.add(this.player);
        
        console.log('✓ Игрок создан');
    }
    
    addPlayerDetails() {
        // Двигатели
        const engineGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 6);
        const engineMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 50
        });
        
        const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
        leftEngine.position.set(-0.8, -1, 0.5);
        leftEngine.rotation.z = Math.PI / 2;
        this.player.add(leftEngine);
        
        const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
        rightEngine.position.set(0.8, -1, 0.5);
        rightEngine.rotation.z = Math.PI / 2;
        this.player.add(rightEngine);
        
        // Кокпит
        const cockpitGeometry = new THREE.SphereGeometry(0.3, 8, 6);
        const cockpitMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.7
        });
        
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.set(0, 0.5, 0);
        this.player.add(cockpit);
    }
    
    createStarField() {
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Случайные позиции в сферической области
            const radius = 1000 + Math.random() * 4000;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Случайные цвета звезд
            const colorType = Math.random();
            if (colorType < 0.7) {
                // Белые звезды
                colors[i3] = 1;
                colors[i3 + 1] = 1;
                colors[i3 + 2] = 1;
            } else if (colorType < 0.85) {
                // Синие звезды
                colors[i3] = 0.7;
                colors[i3 + 1] = 0.8;
                colors[i3 + 2] = 1;
            } else {
                // Красные звезды
                colors[i3] = 1;
                colors[i3 + 1] = 0.7;
                colors[i3 + 2] = 0.7;
            }
        }
        
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        this.stars = stars;
        
        console.log('✓ Звездное поле создано');
    }
    
    createAsteroids() {
        const asteroidCount = 50;
        
        for (let i = 0; i < asteroidCount; i++) {
            this.createAsteroid();
        }
        
        console.log('✓ Астероиды созданы');
    }
    
    createAsteroid() {
        const size = 0.5 + Math.random() * 2;
        const asteroidGeometry = new THREE.IcosahedronGeometry(size, 1);
        
        // Деформация вершин для реалистичности
        const positions = asteroidGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const ix = i * 3;
            positions.array[ix] += (Math.random() - 0.5) * 0.2;
            positions.array[ix + 1] += (Math.random() - 0.5) * 0.2;
            positions.array[ix + 2] += (Math.random() - 0.5) * 0.2;
        }
        
        const asteroidMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 10
        });
        
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        
        // Случайная позиция
        asteroid.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
        );
        
        // Случайное вращение
        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // Случайная скорость вращения
        asteroid.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            rotationVelocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            )
        };
        
        this.scene.add(asteroid);
        this.asteroids.push(asteroid);
    }
    
    setupRendering() {
        // Обработка изменения размера окна
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log('✓ Настройки рендеринга завершены');
    }
    
    onWindowResize() {
        const canvas = document.getElementById('game-canvas');
        const aspect = canvas.clientWidth / canvas.clientHeight;
        
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    
    updatePlayer(controls, playerStats) {
        if (!this.player) return;
        
        // Движение вперед/назад
        if (controls.thrust) {
            this.player.translateZ(-this.PLAYER_SPEED);
        }
        if (controls.brake) {
            this.player.translateZ(this.PLAYER_SPEED * 0.5);
        }
        
        // Поворот влево/вправо
        if (controls.left) {
            this.player.rotateY(this.PLAYER_ROTATION_SPEED);
        }
        if (controls.right) {
            this.player.rotateY(-this.PLAYER_ROTATION_SPEED);
        }
        
        // Стрельба
        if (controls.shoot) {
            this.shoot();
            controls.shoot = false; // Предотвращение автоматической стрельбы
        }
        
        // Обновление камеры (следование за игроком)
        this.updateCamera();
        
        // Обновление позиции игрока в статистике
        playerStats.position = {
            x: this.player.position.x,
            y: this.player.position.y,
            z: this.player.position.z
        };
    }
    
    updateCamera() {
        // Камера следует за игроком с небольшим отставанием
        const cameraOffset = new THREE.Vector3(0, 2, 5);
        const playerWorldPos = new THREE.Vector3();
        this.player.getWorldPosition(playerWorldPos);
        
        const targetCameraPos = playerWorldPos.clone().add(cameraOffset);
        this.camera.position.lerp(targetCameraPos, 0.1);
        
        this.camera.lookAt(this.player.position);
    }
    
    shoot() {
        // Создание лазерного выстрела
        const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const laserMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.5
        });
        
        const laser = new THREE.Mesh(laserGeometry, laserMaterial);
        
        // Позиционирование лазера
        laser.position.copy(this.player.position);
        laser.position.z -= 2;
        
        // Поворот лазера в направлении корабля
        laser.rotation.copy(this.player.rotation);
        
        // Добавление движения
        laser.userData = {
            velocity: new THREE.Vector3(0, 0, -this.LASER_SPEED),
            life: 100
        };
        
        this.scene.add(laser);
        this.lasers.push(laser);
        
        console.log('💥 Выстрел!');
    }
    
    update() {
        if (!this.isInitialized) return;
        
        // Обновление времени
        this.elapsedTime += 1;
        
        // Обновление астероидов
        this.updateAsteroids();
        
        // Обновление лазеров
        this.updateLasers();
        
        // Спавн врагов
        this.spawnEnemies();
        
        // Обновление врагов
        this.updateEnemies();
        
        // Спавн новых астероидов
        if (Math.random() < this.ASTEROID_SPAWN_RATE) {
            this.createAsteroid();
        }
        
        // Обновление звездного поля (эффект движения)
        this.updateStarField();
    }
    
    updateAsteroids() {
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            
            // Вращение астероида
            asteroid.rotation.x += asteroid.userData.rotationVelocity.x;
            asteroid.rotation.y += asteroid.userData.rotationVelocity.y;
            asteroid.rotation.z += asteroid.userData.rotationVelocity.z;
            
            // Движение астероида
            asteroid.position.add(asteroid.userData.velocity);
            
            // Сброс астероида в случайную позицию при уходе слишком далеко
            const distance = asteroid.position.length();
            if (distance > 1000) {
                asteroid.position.set(
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200 - 200
                );
            }
        }
    }
    
    updateLasers() {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            
            // Движение лазера
            laser.position.add(laser.userData.velocity);
            
            // Уменьшение времени жизни
            laser.userData.life--;
            
            // Удаление лазера при истечении времени жизни
            if (laser.userData.life <= 0) {
                this.scene.remove(laser);
                this.lasers.splice(i, 1);
            }
        }
    }
    
    spawnEnemies() {
        if (Math.random() < this.ENEMY_SPAWN_RATE) {
            this.createEnemy();
        }
    }
    
    createEnemy() {
        // Создание врага
        const enemyGeometry = new THREE.OctahedronGeometry(1);
        const enemyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff4444,
            shininess: 50
        });
        
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        
        // Случайная позиция рядом с игроком
        enemy.position.set(
            this.player.position.x + (Math.random() - 0.5) * 50,
            this.player.position.y + (Math.random() - 0.5) * 50,
            this.player.position.z - 30 - Math.random() * 20
        );
        
        this.scene.add(enemy);
        this.enemies.push(enemy);
        
        console.log('👾 Враг появился!');
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Простое движение к игроку
            const direction = new THREE.Vector3()
                .subVectors(this.player.position, enemy.position)
                .normalize();
            
            enemy.position.add(direction.multiplyScalar(0.05));
            
            // Поворот врага
            enemy.rotation.x += 0.01;
            enemy.rotation.y += 0.02;
            
            // Проверка столкновений с игроком
            const distance = enemy.position.distanceTo(this.player.position);
            if (distance < 2) {
                this.handlePlayerCollision(enemy);
            }
            
            // Удаление врагов слишком далеко
            if (distance > 200) {
                this.scene.remove(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updateStarField() {
        // Медленное вращение звездного поля
        if (this.stars) {
            this.stars.rotation.y += 0.0002;
            this.stars.rotation.x += 0.0001;
        }
    }
    
    handlePlayerCollision(enemy) {
        console.log('💥 Столкновение с врагом!');
        
        // Временный эффект столкновения
        this.flashScreen();
        
        // Удаление врага
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.scene.remove(enemy);
            this.enemies.splice(index, 1);
        }
    }
    
    handleCollisions() {
        // Проверка столкновений лазеров с астероидами
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                const asteroid = this.asteroids[j];
                
                const distance = laser.position.distanceTo(asteroid.position);
                if (distance < 2) {
                    // Столкновение!
                    this.createExplosion(asteroid.position);
                    this.destroyAsteroid(j);
                    this.destroyLaser(i);
                    break;
                }
            }
        }
    }
    
    destroyAsteroid(index) {
        const asteroid = this.asteroids[index];
        this.scene.remove(asteroid);
        this.asteroids.splice(index, 1);
        
        // Возможная награда за разрушение
        this.addExperience(10);
        this.addCredits(50);
    }
    
    destroyLaser(index) {
        const laser = this.lasers[index];
        this.scene.remove(laser);
        this.lasers.splice(index, 1);
    }
    
    createExplosion(position) {
        // Создание эффекта взрыва
        const explosionGeometry = new THREE.SphereGeometry(2, 8, 6);
        const explosionMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff6600,
            transparent: true,
            opacity: 0.8
        });
        
        const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
        explosion.position.copy(position);
        
        this.scene.add(explosion);
        
        // Анимация взрыва
        let scale = 1;
        let opacity = 0.8;
        const explosionAnimation = () => {
            scale += 0.1;
            opacity -= 0.05;
            
            explosion.scale.set(scale, scale, scale);
            explosionMaterial.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(explosionAnimation);
            } else {
                this.scene.remove(explosion);
            }
        };
        
        explosionAnimation();
    }
    
    flashScreen() {
        // Эффект мигания экрана при столкновении
        const canvas = document.getElementById('game-canvas');
        canvas.style.filter = 'brightness(2)';
        
        setTimeout(() => {
            canvas.style.filter = 'brightness(1)';
        }, 100);
    }
    
    addExperience(amount) {
        // Добавление опыта игроку
        if (window.spaceRift && window.spaceRift.playerStats) {
            window.spaceRift.playerStats.experience += amount;
            
            // Проверка повышения уровня
            if (window.spaceRift.playerStats.experience >= 
                window.spaceRift.playerStats.experienceToNext) {
                this.levelUp();
            }
        }
    }
    
    addCredits(amount) {
        // Добавление кредитов игроку
        if (window.spaceRift && window.spaceRift.playerStats) {
            window.spaceRift.playerStats.credits += amount;
        }
    }
    
    levelUp() {
        if (window.spaceRift && window.spaceRift.playerStats) {
            window.spaceRift.playerStats.level++;
            window.spaceRift.playerStats.experience = 0;
            window.spaceRift.playerStats.experienceToNext = 
                window.spaceRift.playerStats.level * 100;
            
            console.log('🎉 Повышение уровня!', window.spaceRift.playerStats.level);
            
            // Показать уведомление о повышении уровня
            if (window.spaceRift.showNotification) {
                window.spaceRift.showNotification(
                    'Повышение уровня!', 
                    `Уровень ${window.spaceRift.playerStats.level}`
                );
            }
        }
    }
    
    render() {
        if (this.isInitialized && this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}