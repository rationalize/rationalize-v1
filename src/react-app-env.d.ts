/// <reference types="react-scripts" />

declare const gtag: (
  command: "config" | "set" | "event",
  ...args: any[]
) => void;

// This is defined in index.html
declare const GA_TRACKING_ID: string;
