# vue-maps-tools

This project is a Vue 3 application built with Vite for creating map-related tools.

## Project Setup and Commands

### 1. NPM Commands

First, install the necessary dependencies for the project.

```sh
npm install
```

#### Development

To run the application in development mode with hot-reloading, use the following command.

```sh
npm run dev
```

#### Building for Production

To compile and minify the application for production, use the following command. This will create a `dist` directory with the production-ready files.

```sh
npm run build
```

### 2. Git and GitHub Workflow

To push your local changes to the `master` branch on GitHub, follow these steps.

First, stage your changes:

```sh
git add .
```

Next, commit your changes with a descriptive message:

```sh
git commit -m "Your descriptive commit message"
```

Finally, push your changes to the `master` branch on GitHub:

```sh
git push origin master
```

### 3. Deploying to Firebase Hosting

This project is deployed to Firebase Hosting.

#### Prerequisites

1.  **Install Firebase CLI**: If you don't have it, install the Firebase command-line interface globally.
    ```sh
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**: Authenticate with your Google account.
    ```sh
    firebase login
    ```

#### Environment Variables

You need to set up your environment variables.
1.  Create a `.env` file in the project root (or use `.env.production` for production builds):
    ```
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

#### Deployment Commands

There are scripts in `package.json` to simplify deployment.

*   **Deploy to production**: This will build the app and deploy it to the live site.
    ```sh
    npm run deploy
    ```

*   **Deploy a preview channel**: This will create a temporary preview URL.
    ```sh
    npm run deploy:preview
    ```

#### Usefull Firebase Commands

*   **Initialize project**:
    ```sh
    firebase init hosting
    ```

*   **Served locally**:
    ```sh
    firebase serve
    ```
