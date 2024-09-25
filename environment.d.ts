declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT?: string;
        CLOUD_NAME: string;
        API_KEY: string;
        API_SECRET: string;
        HOST: string,
        USERNAME: string,
        PASSWORD: string,
        DATABASE: string
      }
    }
  }
  
  export {}
  