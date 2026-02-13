use PORT = 5000

# 📋 API Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users | 200, 500 |
| GET | `/users/:id` | Get single user by ID | 200, 400, 404, 500 |
| POST | `/users` | Create a new user | 201, 400, 500 |
| PUT | `/users/:id` | Update an existing user | 200, 400, 404, 500 |
| DELETE | `/users/:id` | Delete a user | 200, 400, 404, 500 |
