<div align="center">

# FastAPI Store Web App

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](https://stripe.com/)
[![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white)](https://auth0.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A modern full-stack e-commerce platform built with FastAPI, React, and Azure.**

</div>

---

## Key Features
- Containerized, full-stack e-commerce web application on Azure with authentication and payments
- Modular backend architecture separating routing, services, and Pydantic-typed data model
- OAuth2 authentication with JWT-based role and scope authorization using Auth0
- Secure authenticated endpoints using FastAPI with Azure SQL connection
- Containerized Azure deployment with CI/CD and deployment pipelines.
- Clean and elegant frontend
- End-to-end testing and 97% unit test coverage with Pytest

## About this project

This was my summer project between first and second year at UBC, studying Computer Science. Over 4 weeks (June 19 - July 13), I independently learned, implemented, and deployed this application over a few intense sprints.

## Website Link

Check it out at [https://nesteagle.gingerstudio.com](https://nesteagle.gingerstudio.com)!

You can use this Stripe test card to try payments:
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
```

*Note: Backend will take a little bit of time to cold start, refresh the page after ~30s.*

## Technology Stack
| Component | Stack |
| --- | --- |
| **Backend** | Python, FastAPI, SQLModel, Pydantic, PyTest|
| **Frontend** | React(Vite), Tailwind CSS, Auth0 SDK|
| **Infrastructure** | Docker, Azure Container Apps, Azure Static Web Apps, GitHub Actions (CI/CD)|
| **Data & Payments** | Azure SQL, Stripe API |

<div align="center">

*⭐ If you liked this project, give it a star!*

</div>