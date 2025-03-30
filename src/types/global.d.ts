/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

interface MongooseCacheType {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  interface Window {
    gtag: any;
    Intercom: any;
    dataLayer: any;
    intercomSettings: any;
    fbq: any;
    mongooseCache: any;
  }
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCacheType | undefined;
}
