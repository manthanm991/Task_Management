# Task Management Application
This project is a full-stack task management application built with Django (backend) and React.js (frontend).

## Prerequisites

Python 3.8+<br>
Node.js 14+<br>
npm 6+<br>
PostgreSQL<br>

## Setup
# 1. Backend (Django)

Clone the repository:<br>
`git clone https://github.com/yourusername/task-management-app.git`<br>
`cd task-management-app`<br><br>

Create a virtual environment and activate it:<br>
`python -m venv venv`<br>
`source venv/bin/activate  # On Windows use 'venv\Scripts\activate'`<br><br>

Install Python dependencies:`pip install -r requirements.txt`<br>

Create a .env file in the Django project root with the following content:<br>
`DJANGO_SECRET_KEY='project_secrect_key'`<br>
`DB_ENGINE='database_engine'`<br>
`DB_NAME='your_database_name'`<br>
`DB_USER='your_username'`<br>
`DB_PASSWORD='your_password'`<br>
`DB_HOST=localhost`<br>
`DB_PORT=5432`<br><br>

Note: In a production environment, use a different secret key and secure database credentials.<br>

Run migrations: `python manage.py migrate`<br><br>
Start the Django development server: `python manage.py runserver`<br>

# 2. Frontend (React.js)
Navigate to the frontend directory: `cd frontend` <br><br>
Install Node.js dependencies: `npm install` <br><br>
Create a .env file in the frontend root directory with the following content: `REACT_APP_API_URL=http://localhost:8000`<br><br>
Start the React development server: `npm start`<br><br>

## Running the Application
1. Ensure the Django server is running on http://localhost:8000
2. Ensure the React app is running on http://localhost:3000
3. Open your browser and go to http://localhost:3000 to use the application

## Development
To run both frontend and backend concurrently:`npm run dev`<br><br>
This command uses the `concurrently` package to start both servers simultaneously.

## Testing
For backend tests: `python manage.py test` <br>
For frontend tests: `npm test`
