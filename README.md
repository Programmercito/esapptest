# Test project - Simulador de transacciones entre clientes

Este es un proyecto de Angular que utiliza un `json-server` como backend simulado.

## Opciones de Ejecución

Puedes ejecutar este proyecto de dos maneras: usando Docker (recomendado para un entorno aislado y consistente) o localmente en tu máquina.

---

### 1. Ejecutar con Docker (Recomendado)

Esta es la forma más sencilla de levantar todo el entorno de desarrollo (frontend y backend) con un solo comando.

#### Prerrequisitos
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Docker Compose](https://docs.docker.com/compose/install/) (generalmente incluido con Docker Desktop)

#### Pasos
1.  Asegúrate de que Docker Desktop esté en ejecución.
2.  Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando:

    ```bash
    docker-compose up --build
    ```
    *   La opción `--build` es necesaria la primera vez para construir la imagen de Angular. Puede tardar unos minutos.
    *   Si quieres que se ejecute en segundo plano, puedes añadir la opción `-d`.

3.  Una vez que los contenedores estén listos:
    *   **Frontend (Angular)** estará disponible en: `http://localhost:4200`
    *   **Backend (API)** estará disponible en: `http://localhost:3000`

---

### 2. Ejecutar Localmente

Si prefieres no usar Docker, puedes ejecutar el frontend y el backend por separado en tu máquina.

#### Prerrequisitos
*   [Node.js](https://nodejs.org/) (versión 20.x recomendada)
*   [Angular CLI](https://angular.dev/tools/cli) instalado globalmente.

    ```bash
    npm install -g @angular/cli
    ```

#### Pasos
1.  **Instalar dependencias:**
    Abre una terminal en la raíz del proyecto y ejecuta:
    ```bash
    npm install
    ```

2.  **Iniciar el Backend (json-server):**
    En una terminal, ejecuta el siguiente comando para iniciar el servidor de la API:
    ```bash
    npx json-server --watch db.json
    ```
    El backend estará disponible en `http://localhost:3000`.

3.  **Iniciar el Frontend (Angular):**
    En **otra** terminal, ejecuta el siguiente comando para iniciar la aplicación de Angular:
    ```bash
    ng serve
    ```
    El frontend estará disponible en `http://localhost:4200`. La aplicación se recargará automáticamente si realizas cambios en los archivos.