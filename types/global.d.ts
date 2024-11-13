declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    APP_COS_BASE: string;

    APP_COS_SECRET_ID: string;
    APP_COS_SECRET_KEY: string;
    APP_COS_REGION: string;
    APP_COS_BUCKET: string;
    APP_COS_BUCKET_PATH: string;
  }
}

/**
 * `Array`, or not yet.
 */
declare type Arrayable<T> = T | Array<T>;

/**
 * `null` or whatever.
 */
declare type Nullable<T> = T | null | undefined;

/**
 * Cloud function apply result.
 */
declare type ApplyResult<T> = {
  code: number;
  result: T;
  message: string;
  timestamp: number;
};
