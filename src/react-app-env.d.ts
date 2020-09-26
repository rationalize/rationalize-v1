/// <reference types="react-scripts" />

declare function gtag(
  command: "config" | "set" | "event",
  ...args: any[]
): void;

// This is defined in index.html
declare const GA_TRACKING_ID: string;

declare namespace NodeJS {
  interface Global {
    // The gtag function - allowing it to be overridden if never defined
    gtag: typeof gtag;
  }
}
