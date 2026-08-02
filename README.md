# Courseflow: E-Learning Management Platform

Welcome to **Courseflow**, my capstone project for the **Spark to Code 2026** bootcamp. This platform bridges the gap between learning and teaching, allowing instructors to build structured courses while enabling students to enroll, submit trackable assignments, tackle quizzes, and earn printable completion certificates.

This project represents the accumulation of everything covered throughout the bootcamp, alongside key self-study architectural milestones (JWT Auth and Email Services) required for production backend deployment.

---

## 🚀 Business Core & Features

The platform serves as a lightweight Learning Management System (LMS) with three core domains:

*   **Course Architecture:** Instructors can fully manage a hierarchy of learning materials structured into **Courses ➔ Modules ➔ Lessons**.
*   **Student Progression:** Tracking user enrollment, storing student-submitted assignments, evaluating quiz results, and generating automated progress status.
*   **Achievements:** Evaluation engine checking completion conditions to issue a system verification certificate upon successfully wrapping up all course criteria.

---

## 🛠️ Tech Stack & Architecture

This application utilizes a decoupled, modern multi-tier architecture focusing heavily on a robust, highly optimized relational database backend.

*   **Database Engine:** Microsoft SQL Server
*   **Data Access Tier:** Entity Framework Core (EF Core) via standard Code-First Migration patterns.
*   **Backend REST Framework:** ASP.NET Core Web API written in C#
*   **Data Querying Engine:** Language Integrated Query (LINQ) optimized for seamless filtering and projection operations.
*   **Frontend Client:** Responsive HTML5, JavaScript, and Bootstrap CSS.

---

## 🗺️ Project Execution Roadmap

The repository is organized following a strict, clean-code lifecycle structure:

1.  **ERD & Relational Mapping:** Crafting complex relationships including One-to-Many (`Course ➔ Modules`) and Many-to-Many (`Students 👥 Courses` via an explicit `Enrollment` bridge entity).
2.  **C# Model Generation:** Building deterministic Domain Entities with strong data types, constraints, and navigational properties.
3.  **EF Core DbContext:** Managing the `DbContext` lifecycle, mapping configurations using Fluent API or Data Annotations, and maintaining clean local SQL Server Express connection behaviors.
4.  **Web API Controllers:** Building secure REST endpoints to handle clean CRUD processes, returning standard HTTP responses (`200 OK`, `201 Created`, `400 BadRequest`, `404 NotFound`).

---

## 🧪 Advanced Implementation & Self-Study Requirements

Beyond standard CRUD logic, this backend implements two production-grade micro-features researched independently using official Microsoft Documentation:

### 🔑 1. Stateless Authentication (JSON Web Tokens - JWT)
*   Replaced vulnerable session states with secure, stateless, signed JWTs.
*   Implements role-based access tokens to cleanly partition endpoints so only `Instructors` can author curriculum details while `Students` can submit course materials.
*   *Resources Used:* `Microsoft.AspNetCore.Authentication.JwtBearer`

### 📧 2. Asynchronous Email Notification Service
*   Integrates a reliable backend notification system to automatically message students immediately upon successful course enrollment or when a certificate is earned.
*   Abstracted via a dependency-injected messaging interface utilizing standard SMTP transport parameters.

---

## 💻 Local Quickstart

### Prerequisites
*   .NET 8.0 / 9.0 SDK
*   SQL Server Express (`.\SQLEXPRESS`)
*   Visual Studio 2022

### 1. Database Provisioning
Ensure your local Connection String inside your `DbContext` (or `appsettings.json`) correctly matches your system instance. Open the **Package Manager Console** in Visual Studio (`Tools ➔ NuGet Package Manager ➔ Package Manager Console`) and run the following commands to generate and apply your database schema instantly:

```powershell
# Create the initial schema snapshot mapping your entities
Add-Migration InitialCreate

# Execute the migration script to build the database inside .\SQLEXPRESS
Update-Database
