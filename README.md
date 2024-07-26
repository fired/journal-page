# Journal Page

## Project Overview

This project is a web application that includes a Docker setup, an Express.js server, and various frontend assets to create your own "Terminal" inspired journal. 

### Public Directory

- **public/styles.css**: This file contains the CSS styles for the application.
- **public/fav.png**: This is the favicon for the application.

### Views Directory

- **views/index.ejs**: This file contains the EJS template for the main page.
- **views/edit.ejs**: This file contains the EJS template for the edit page.
- **views/admin.ejs**: This file contains the EJS template for the admin page.
- **views/login.ejs**: This file contains the EJS template for the login page.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation

1. Clone the repository
   ```sh
   git clone <repository-url>
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Running the Application

1. Start the server
   ```sh
   node app.js
   ```
2. Open your browser and navigate to `http://localhost:3000`

### Using Docker

1. Build the Docker image
   ```sh
   docker build -t project-name .
   ```
2. Run the Docker container
   ```sh
   docker run -p 3000:3000 project-name
   ```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/fired/journal-page](https://github.com/fired/journal-page)