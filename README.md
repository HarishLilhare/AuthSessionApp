User Authentication and Session Management: A Guide to Implementation
Objective:

This assignment aims to equip you with the skills and knowledge to implement secure user authentication and session management in a web application. The primary objectives include:

Understanding and implementing secure user registration and login processes.
Mastering the use of JWTs for session management and access control.
Implementing robust security measures to protect user data and prevent common vulnerabilities.
Gaining practical experience with database interactions for user data storage (using SQLite).
Developing skills in testing and logging authentication and session-related functionalities.
Understanding password reset flows with time-limited tokens.
Step-by-Step Instructions:

Project Setup and Initialization:

Create Project Directory: Create a new directory for your project (e.g., "auth-app").
Initialize Node.js Project: Navigate to the project directory in your terminal and run npm init -y to initialize a new Node.js project. This will create a package.json file.
Install Dependencies: Install the necessary packages using npm. You will need express, sqlite3, jsonwebtoken, bcrypt, nodemailer (or similar email sending library), and any testing libraries you choose. For Example: npm install express sqlite3 jsonwebtoken bcrypt nodemailer.
Configure Project Structure: Create a basic project structure with directories for models, routes, middleware, controllers, utilities, and tests. A simple structure could look like this:
auth-app/
├── models/
├── routes/
├── middleware/
├── controllers/
├── utils/
├── tests/
├── app.js
├── package.json
└── ...
Set up SQLite Database: Install the SQLite command-line tool if it isn't already present. Create an empty database file in the project root (e.g., database.db).
Development Process:

Database Model Creation (User): Define the database schema for the user model in the models directory using SQLite. This schema should include fields for username, email, and a securely hashed password. Consider adding fields for password reset tokens and timestamps. You'll need to use SQLite's methods for creating tables and defining column data types.
User Registration Implementation:
Create a registration route in the routes directory (e.g., /register).
Create a registration controller function in the controllers directory. This function should:
Receive user registration data (username, email, password) from the request body.
Validate the input data to ensure it meets the defined criteria (e.g., email format, password strength).
Hash the user's password using a strong hashing algorithm like bcrypt.
Store the user's information (username, email, hashed password) in the SQLite database.
Handle potential errors, such as duplicate usernames or invalid input.
User Login Implementation:
Create a login route in the routes directory (e.g., /login).
Create a login controller function in the controllers directory. This function should:
Receive user login credentials (username/email and password) from the request body.
Retrieve the user's information from the SQLite database based on the provided username or email.
Compare the provided password with the stored hashed password using bcrypt's comparison function.
If the credentials are valid:
Create a JWT (JSON Web Token) containing user information.
Set the JWT as an HTTP-only cookie in the response or return it in the response body.
If the credentials are invalid, return an appropriate error message.
Session Management Implementation:
Configure your Express application to use middleware for parsing cookies or handling the JWT from the response body.
Implement a middleware function to verify the JWT on protected routes.
This middleware should:
Extract the JWT from the request (either from cookies or request body).
Verify the JWT's signature using your secret key.
If the JWT is valid, extract the user information from the JWT payload and attach it to the request object.
If the JWT is invalid or expired, return an unauthorized error or redirect the user to the login page.
Implement a logout route that clears the user's JWT cookie or removes the JWT from the client-side storage.
Access Control Implementation:
Apply the JWT verification middleware to the routes that require authentication. This middleware will ensure that only authenticated users can access these routes.
For unauthenticated users attempting to access protected routes, redirect them to the login page.
Password Reset Implementation:
Create a "forgot password" route in the routes directory (e.g., /forgot-password).
Create a controller function that:
Receives the user's email address.
Checks if the email exists in the database.
Generates a unique, time-limited token.
Stores the token and its expiration timestamp in the user's database record.
Sends an email to the user with a link to reset their password, including the token in the URL.
Create a "reset password" route in the routes directory (e.g., /reset-password/:token).
Create a controller function that:
Receives the token from the URL parameters.
Retrieves the user from the database based on the token.
Verifies that the token is valid and has not expired.
Renders a form for the user to enter a new password.
Create a route to handle the password reset form submission.
Create a controller function that:
Receives the new password from the form.
Hashes the new password.
Updates the user's password in the database.
Invalidates the token.
Redirects the user to the login page or displays a success message.
Security Measures Implementation:
Password Hashing: Use bcrypt (or a similar library) with a sufficient salt rounds to securely hash user passwords.
HTTPS: Configure your Express application to use HTTPS for secure communication. This typically involves obtaining an SSL certificate and configuring your server to use it.
Input Sanitization and Validation: Implement robust input sanitization and validation to prevent common vulnerabilities such as Cross-Site Scripting (XSS) and SQL injection. Use appropriate validation libraries and escape user input before displaying it in the browser.
Logging Implementation:
Install a logging library such as Winston or Morgan.
Configure the logging library to write logs to a file or a centralized logging service.
Log important events and errors related to authentication and session management, such as:
User registration attempts.
Login attempts (successful and failed).
Logout events.
Password reset requests.
Authentication errors.
Application errors.
Testing Implementation:
Use a testing framework such as Mocha or Jest.
Write unit tests to verify the functionality of individual modules, such as password hashing, JWT generation, and database interactions.
Write integration tests to verify the interaction between different modules, such as user registration, login, and session management.
Cover all acceptance criteria with comprehensive test cases.
