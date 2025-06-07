# Feed Focus Frontend
Feed Focus is a modern news aggregation platform that brings you personalized, real-time news feeds from around the world. This repository contains the frontend codebase, built with React and Material UI, designed for seamless integration with a Spring Boot backend.

**Features**

* **Personalized News Feed**: Get articles tailored to your interests and preferences.
* **Authentication**: Secure login and registration with JWT-based sessions.
* **Bookmarks**: Save your favorite articles for later reading.
* **Topic Filtering**: Browse news by category, country, or trending topics.
* **Responsive UI**: Mobile-friendly design using Material UI.
* **Dark/Light Mode**: Toggle between light and dark themes with device preference support.
* **Profile Management**: Edit your news preferences and view your bookmarks.
* **Protected Routes**: User dashboard and profile are accessible only when logged in.
* **Error Handling**: Friendly 404 and error screens.

**Tech Stack**

* **React** (with hooks and functional components)
* **Redux Toolkit** (for state management)
* **Material UI** (for theming and UI components)
* **Axios** (for API requests)
* **React Router v6**

**Installation**

Follow these steps to get FeedScoop Frontend up and running locally:

1.  **Clone the repository:**
    ```
    git clone [https://github.com/mohanseetha/feed-focus.git](https://github.com/mohanseetha/feed-focus.git)
    ```
2.  **Navigate to the project directory:**
    ```
    cd feed-focus-frontend
    ```
3.  **Install dependencies:**
    ```
    npm install
    ```
4.  **Configure environment variables:**
    Create a `.env` file in the root directory of the project with the following content, replacing `your-backend-url` with the actual URL of your Spring Boot backend:
    ```
    VITE_API_BASE_URL=http://localhost:8080
    ```
5.  **Start the development server:**
    ```
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or your Vite port).

**Project Structure**
```
src/
├── components/   # Reusable UI components (ArticleCard, Navbar, etc.)
├── pages/        # Page-level components (Home, Auth, Profile, NotFound)
├── redux/        # Redux slices and store
├── utils/        # API utilities and helpers
├── theme/        # MUI theme and customization
├── layout/       # Layout wrappers
├── App.jsx       # App entry point
└── main.jsx      # React root
```
**Contributing**
Pull requests, issues, and suggestions are welcome! Please open an issue to discuss your ideas or report bugs.
