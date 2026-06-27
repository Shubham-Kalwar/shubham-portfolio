# Shubham Portfolio Monorepo

Welcome to the **Shubham Portfolio** monorepo. This project contains both the backend and frontend components.

---

## 🛠️ Tech Stack

This project is built using a modern, robust, and high-performance stack. The following versions are installed and verified on this system:

* **Java**: 25 (Java(TM) SE Runtime Environment, build 25+37-LTS-3491)
* **Maven**: 3.9.11 (Apache Maven 3.9.11)
* **Node.js**: v22.20.0
* **Angular CLI**: 21.1.3
* **Package Manager**: npm 11.7.0

---

## ⚙️ Local Setup

To get the application up and running locally, follow these steps:

### Prerequisites
Ensure you have the required versions of Java, Maven, Node, and Angular CLI installed as listed above.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project using Maven:
   ```bash
   mvn clean install
   ```
3. Run the Java application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:4200/`.

---

## 📖 API Docs

The backend exposes a RESTful API. Once the backend is running, you can access the API documentation at:

* **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
* **OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

---

## 🚀 Deployment

Detailed instructions for staging and production deployments.

### Backend Deployment
Build a production JAR:
```bash
cd backend
mvn clean package -DskipTests
```
The deployable package will be generated under `backend/target/`.

### Frontend Deployment
Build the production-ready Angular assets:
```bash
cd frontend
ng build --configuration production
```
The compiled output will be generated under the `dist/` directory, ready to be served by a web server or a CDN.
