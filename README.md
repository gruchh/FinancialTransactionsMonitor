# Financial Transactions Monitor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)

A web application for managing investment portfolios and tracking trades. Built with **Spring Boot** (backend), **React** (frontend), and containerized using **Docker**. Users can manage funds, log trades with details (date, position, EUR/PLN exchange rate), and calculate profits based on real-time fund prices fetched via REST APIs.

## 🚀 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.5.0**
- **Spring Data JPA** - Database operations
- **Spring WebFlux** - Reactive web framework
- **PostgreSQL** - Primary database
- **Hibernate Validator 8.0.2** - Data validation
- **SpringDoc OpenAPI 2.8.8** - API documentation
- **Lombok** - Code generation

### Frontend
- **React 19.1.0** - UI framework
- **Vite 6.3.5** - Build tool and dev server
- **React Router DOM 7.6.2** - Client-side routing
- **Tailwind CSS 4.1.8** - Styling framework
- **Tailwind CSS Animated 2.0** - Animation utilities
- **Formik 2.4.6** - Form handling
- **Recharts 2.15.3** - Data visualization
- **Lucide React 0.513.0** - Icon library

## 📋 Features

- 📊 **Portfolio Management** - Track investment funds and their performance
- 💰 **Trade Logging** - Record buy/sell transactions with detailed information
- 📈 **Real-time Pricing** - Fetch current fund prices via REST APIs
- 💱 **Currency Exchange** - Handle EUR/PLN exchange rates
- 📊 **Profit Calculation** - Automatic profit/loss calculations
- 📱 **Responsive Design** - Modern, mobile-friendly interface
- 🔍 **API Documentation** - Interactive OpenAPI/Swagger documentation

## 🛠️ Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Run with Maven
./mvnw spring-boot:run

# Or build JAR
./mvnw clean package
java -jar target/monitor-0.0.1-SNAPSHOT.jar
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Setup
```bash
# Run entire application with Docker Compose
docker-compose up -d

# Build and run
docker-compose up --build
```

## 📚 API Documentation

When the application is running, visit:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

## 🗄️ Database

The application uses PostgreSQL as the primary database. Database schema is managed through JPA/Hibernate with automatic DDL generation.

## 🧪 Development

### Backend
- **Spring Boot DevTools** enabled for hot reload
- **Lombok** for reducing boilerplate code
- **Hibernate Validator** for data validation
- **Spring WebFlux** for reactive programming

### Frontend
- **ESLint** for code linting
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Formik** for form state management

### Scripts
```bash
# Frontend linting
npm run lint

# Frontend preview build
npm run preview
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please create an issue in this repository.