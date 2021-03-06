declare module 'express-session' {
  interface SessionData {
    userId: number;
    interaction: {
      state: string;
      returnTo: string;
    }
  }
}
export {};