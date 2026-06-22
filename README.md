# TaskForge

A full-stack task and project management application built with Angular and Spring Boot.

## Tech Stack

**Frontend:** Angular, TypeScript, Angular Material, Angular CDK  
**Backend:** Spring Boot, Java 21, Spring Security, JWT, Spring Data JPA, Hibernate  
**Database:** Oracle Database 26ai Free

## Project Structure

```
TaskForge/
├── taskforge-ui/     ← Angular frontend
├── taskforge-api/    ← Spring Boot backend
├── db/               ← Oracle SQL scripts
└── README.md
```

## Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- Oracle Database 26ai Free

### Database Setup
See [db/README.md](db/README.md) for full instructions.

### Backend Setup
1. Copy `taskforge-api/src/main/resources/application.yml.example`
   to `application.yml` and fill in your credentials
2. Use the provided run script instead of mvnw directly:
`build_deploy.cmd` 

This sets the required JVM timezone argument for Oracle JDBC compatibility.

### Frontend Setup
1. Run `npm install` from the `taskforge-ui` folder
2. Run `ng serve`
3. Open `http://localhost:4200`