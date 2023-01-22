declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MESSAGE_BROKER_URL: string;
    }
  }
}

export {};
