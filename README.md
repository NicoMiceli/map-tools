# vue-maps-tools

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Deploying to Netlify

### Prerequisites

1. Install Netlify CLI globally:
```sh
npm install -g netlify-cli
```

2. Login to Netlify:
```sh
netlify login
```

### Environment Setup

1. Create a `.env` file in the project root with your Google Maps API key:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

2. Set up the environment variable in Netlify:
```sh
netlify env:set VITE_GOOGLE_MAPS_API_KEY your_api_key_here
```

### Deployment

1. Initialize Netlify project (first time only):
```sh
netlify init
```

2. Deploy to draft URL:
```sh
npm run deploy:draft
```

3. Deploy to production:
```sh
npm run deploy:prod
```

### Other deployment options

- Deploy to draft URL:
```sh
sudo netlify deploy   
```

- Deploy to production URL:
```sh
sudo netlify deploy --prod
```

- Deploy with cache clearing:
```sh
netlify deploy --prod --force
```

### Useful Netlify Commands

- Check site status:
```sh
netlify status
```

- Open site admin panel:
```sh
netlify open
```

- View deployment logs:
```sh
netlify watch
```
