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

### 3. Deploying to Netlify

This project can be deployed to Netlify.

#### Prerequisites

1.  **Install Netlify CLI**: If you don't have it, install the Netlify command-line interface globally.
    ```sh
    npm install -g netlify-cli
    ```

2.  **Login to Netlify**: Authenticate with your Netlify account.
    ```sh
    netlify login
    ```

#### Environment Variables

You need to set up your Google Maps API key as an environment variable in Netlify.

1.  Create a `.env` file in the project root with your Google Maps API key for local development:
    ```
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
    ```

2.  Set the environment variable in your Netlify project settings. You can do this through the Netlify UI or via the CLI:
    ```sh
    netlify env:set VITE_GOOGLE_MAPS_API_KEY your_api_key_here
    ```

#### Deployment Commands

There are scripts in `package.json` to simplify deployment.

*   **Deploy to a draft URL**: This will give you a preview of your deployment.
    ```sh
    npm run deploy:draft
    ```

*   **Deploy to production**: This will deploy your site to the main URL.
    ```sh
    npm run deploy:prod
    ```

You can also use the Netlify CLI directly for more control:

*   **Deploy to a draft URL**:
    ```sh
    netlify deploy
    ```

*   **Deploy to production**:
    ```sh
    netlify deploy --prod
    ```

*   **Force a production deploy without cache**:
    ```sh
    netlify deploy --prod --force
    ```

#### Useful Netlify Commands

*   **Check site status**:
    ```sh
    netlify status
    ```

*   **Open site admin panel**:
    ```sh
    netlify open
    ```

*   **View deployment logs**:
    ```sh
    netlify watch
    ```
