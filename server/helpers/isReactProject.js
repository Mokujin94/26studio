const fs = require('fs');
const path = require('path');

/**
 * Проверяет, является ли проект React-проектом
 * @param {string} projectDir - путь к папке проекта
 * @returns {object} - { isReact: boolean, packageJson: object|null, buildScript: string|null }
 */
function isReactProject(projectDir) {
    try {
        // Ищем package.json в корне или в первой подпапке
        let packageJsonPath = path.join(projectDir, 'package.json');
        
        // Если package.json не в корне, ищем в первой подпапке
        if (!fs.existsSync(packageJsonPath)) {
            const items = fs.readdirSync(projectDir);
            for (const item of items) {
                const itemPath = path.join(projectDir, item);
                if (fs.statSync(itemPath).isDirectory()) {
                    const nestedPackageJson = path.join(itemPath, 'package.json');
                    if (fs.existsSync(nestedPackageJson)) {
                        packageJsonPath = nestedPackageJson;
                        break;
                    }
                }
            }
        }

        if (!fs.existsSync(packageJsonPath)) {
            return { isReact: false, packageJson: null, buildScript: null, projectRoot: null };
        }

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};
        
        // Проверяем наличие React
        const hasReact = 'react' in dependencies || 'react' in devDependencies;
        
        // Проверяем наличие Vue
        const hasVue = 'vue' in dependencies || 'vue' in devDependencies;
        
        // Проверяем наличие скрипта сборки
        const scripts = packageJson.scripts || {};
        let buildScript = null;
        
        if (scripts.build) {
            buildScript = 'build';
        } else if (scripts['build:prod']) {
            buildScript = 'build:prod';
        }

        const projectRoot = path.dirname(packageJsonPath);

        return {
            isReact: hasReact || hasVue,
            packageJson,
            buildScript,
            projectRoot,
            framework: hasReact ? 'react' : hasVue ? 'vue' : null
        };
    } catch (error) {
        console.error('Error checking React project:', error);
        return { isReact: false, packageJson: null, buildScript: null, projectRoot: null };
    }
}

/**
 * Находит папку с собранным проектом
 * @param {string} projectDir - путь к папке проекта
 * @returns {string|null} - путь к папке dist/build или null
 */
function findBuildFolder(projectDir) {
    const possibleNames = ['dist', 'build', 'out', '.output', '.next'];
    
    for (const name of possibleNames) {
        const buildPath = path.join(projectDir, name);
        if (fs.existsSync(buildPath) && fs.statSync(buildPath).isDirectory()) {
            // Проверяем есть ли index.html
            const indexHtml = path.join(buildPath, 'index.html');
            if (fs.existsSync(indexHtml)) {
                return buildPath;
            }
        }
    }
    
    return null;
}

module.exports = { isReactProject, findBuildFolder };

