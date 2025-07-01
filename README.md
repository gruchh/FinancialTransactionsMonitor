# Financial Transactions Monitor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)

A comprehensive web application for managing investment portfolios and tracking financial trades. Built with **Spring Boot** (backend), **React** (frontend), and containerized using **Docker**. The application enables users to manage investment funds, log detailed trades with EUR/PLN exchange rates, and calculate profits based on real-time fund prices.

## 🚀 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.5.0** - Main framework
- **Spring Data JPA** - Database operations
- **Spring WebFlux 6.2.7** - Reactive web framework
- **Spring Security 3.5.0** - Authentication & authorization
- **PostgreSQL** - Primary database
- **H2 Database 2.3.232** - Development/testing database
- **Hibernate Validator 8.0.2** - Data validation
- **SpringDoc OpenAPI 2.8.8** - API documentation
- **JWT (JJWT 0.12.6)** - Token-based authentication
- **MapStruct 1.6.3** - Object mapping
- **Lombok** - Code generation

### Frontend
- **React 19.1.0** - UI framework
- **Vite 6.3.5** - Build tool and dev server
- **React Router DOM 7.6.2** - Client-side routing
- **Tailwind CSS 4.1.8** - Styling framework
- **Tailwind CSS Animated 2.0** - Animation utilities
- **Formik 2.4.6** - Form handling
- **Yup 1.6.1** - Form validation
- **Recharts 2.15.3** - Data visualization
- **Lucide React 0.513.0** - Icon library
- **Axios 1.10.0** - HTTP client
- **React Hot Toast 2.5.2** - Notifications

## 📋 Key Features

- 🔐 **Authentication & Security** - JWT-based authentication with Spring Security
- 📊 **Portfolio Management** - Comprehensive investment portfolio tracking
- 💰 **Trade Management** - Detailed buy/sell transaction logging
- 📈 **Real-time Fund Pricing** - Integration with external fund price APIs
- 💱 **Currency Exchange** - EUR/PLN exchange rate handling
- 📊 **Profit/Loss Calculation** - Automated financial calculations
- 📱 **Responsive Design** - Modern, mobile-first interface
- 🔍 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 🗄️ **Dual Database Support** - PostgreSQL for production, H2 for development

## 🛠️ Development Setup

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **Maven 3.6+**
- **Docker & Docker Compose**
- **PostgreSQL** (for production)

### Backend Setup
```bash
# Navigate to project root
cd financial-transactions-monitor

# Run with Maven (uses H2 database by default)
./mvnw spring-boot:run

# Build JAR file
./mvnw clean package
java -jar target/FinancialTransactionsMonitor-0.0.1-SNAPSHOT.jar
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

# Preview production build
npm run preview
```

### Docker Setup
```bash
# Run entire application stack
docker-compose up -d

# Build and run with latest changes
docker-compose up --build

# Stop all services
docker-compose down
```

## 🔧 Configuration

### Database Configuration
The application supports both H2 (development) and PostgreSQL (production):

- **H2**: Automatically configured for development with web console access
- **PostgreSQL**: Configure connection details in `application.properties`

### Security Configuration
JWT-based authentication is implemented with configurable token expiration and secret keys.

### External API Integration
The application integrates with external fund pricing APIs for real-time data updates.

## 📚 API Documentation

When the backend is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Specification**: `http://localhost:8080/v3/api-docs`

## 🧪 Testing & Development

### Backend Development
- **Spring Boot DevTools** - Hot reload during development
- **Lombok** - Reduces boilerplate code
- **MapStruct** - Type-safe object mapping
- **Hibernate Validator** - Comprehensive data validation

### Frontend Development
- **ESLint** - Code quality and consistency
- **Vite** - Fast development server and optimized builds
- **Tailwind CSS** - Utility-first styling approach
- **React Hot Toast** - User-friendly notifications

### Available Scripts
```bash
# Frontend
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Run ESLint

# Backend
./mvnw spring-boot:run    # Run application
./mvnw clean package      # Build JAR
./mvnw test              # Run tests
```

## 🚀 Deployment

### Production Deployment
1. Configure PostgreSQL database connection
2. Set up environment variables for JWT secrets
3. Build frontend assets: `npm run build`
4. Package backend: `./mvnw clean package`
5. Deploy using Docker Compose or individual containers

### Environment Variables
```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/financial_monitor
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000
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

---

**Built with ❤️ using Spring Boot and React**