To complete the setup and run the application, follow these steps carefully:

1. **Clone the Repository:** Download or clone the project : https://github.com/suryansh1801/astro-culture-apis.git code onto your local machine by using the following command.
    
    ```jsx
    git clone https://github.com/suryansh1801/astro-culture-apis.git
    ```
    
2. **Change directory to pie-pay :** Run the following command 
    
    ```jsx
    cd astro-culture-apis
    ```
    
3. **Install Dependencies:** Run the following command in the project root to install all required Node.js packages:
    
    ```jsx
    npm install
    ```
    
4. **Set Up Environment Variables** file in the project root if needed (for database URLs, secrets, etc.). **`Create a .env in the project root with the following variables.`**
    
    ```jsx
    PORT=3001
    MONGO_URI=mongodb://127.0.0.1:27017/horoscopeDB
    JWT_SECRET=astroculture_assignment_suryansh1801
    RATE_LIMIT_TIME=60000
    ```
    
5. **Start MongoDB:** with the correct remote connection string. Make sure you have MongoDB installed and running locally or update your .env with the correct remote connection string.
6. **Run the Server:**Start the Express server with:
    
    ```jsx
    npm run dev
    ```
    
7. **Test the Endpoints:** and  endpoints.
    
    Use Postman or similar tools to test the following curls : 
    
    1. POST  :  /signup
    
    ```jsx
    curl --location 'http://localhost:3001/api/auth/signup' \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "name": "Suryansh Sahu",
      "email": "Suryansh.sahu@example.com",
      "password": "password123",
      "birthdate": "2012-10-12"
    }'
    ```
    
    1. POST : /login
    
    ```jsx
    curl --location 'http://localhost:3001/api/auth/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "email": "suryansh.sahu@example.com",
      "password": "password123"
    }'
    ```
    

1. GET : /today

```jsx
curl --location 'http://localhost:3001/api/horoscope/today' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTE5MmJmZDllNTZiZjVmOThiODQyYyIsImlhdCI6MTc1NTQzNjA4OCwiZXhwIjoxNzU1NTIyNDg4fQ.tAam8lHnaw4yyVBKqrwqX5oX6bf7ttDnPRdy5j8LTzw'
```

4. GET : /history

```jsx
curl --location 'http://localhost:3001/api/horoscope/history' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTE5MmJmZDllNTZiZjVmOThiODQyYyIsImlhdCI6MTc1NTQzNjA4OCwiZXhwIjoxNzU1NTIyNDg4fQ.tAam8lHnaw4yyVBKqrwqX5oX6bf7ttDnPRdy5j8LTzw'
```

5. GET: /today for rate-limiting check

```jsx
curl --location 'http://localhost:3001/api/horoscope/today' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTE5YTU4N2E0ZGNkYTAwMTk5OGI4ZSIsImlhdCI6MTc1NTQyMTI3MiwiZXhwIjoxNzU1NTA3NjcyfQ.s5BwM6QstBBd6uVS_W07Wd844EEIqL4zsrb3RVg0cNM'
```

1. API docs 

```jsx
http://localhost:3001/api-docs/
```
