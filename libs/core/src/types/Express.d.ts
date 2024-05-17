import { AUTH_TYPE } from './enums';

export declare namespace Express {
  export interface Request {
    payload: {
      [key: string]: any;
      id: number;
      iss?: string | undefined;
      sub?: string | undefined;
      aud?: string | string[] | undefined;
      exp?: number | undefined;
      nbf?: number | undefined;
      iat?: number | undefined;
      jti?: string | undefined;
    };

    /** `Multer.File` object populated by `single()` middleware. */
    file?: Multer.File | undefined;
    /**
     * Array or dictionary of `Multer.File` object populated by `array()`,
     * `fields()`, and `any()` middleware.
     */
    files?:
      | {
          [fieldname: string]: Multer.File[];
        }
      | Multer.File[]
      | undefined;
  }
  export interface User {
    id: number;
    tokenType: number;
    userType: string;
  }
  export namespace Multer {
    /** Object containing file metadata and access information. */
    interface File {
      /** Name of the form field associated with this file. */
      fieldname: string;
      /** Name of the file on the uploader's computer. */
      originalname: string;
      /**
       * Value of the `Content-Transfer-Encoding` header for this file.
       * @deprecated since July 2015
       * @see RFC 7578, Section 4.7
       */
      encoding: string;
      /** Value of the `Content-Type` header for this file. */
      mimetype: string;
      /** Size of the file in bytes. */
      size: number;
      /**
       * A readable stream of this file. Only available to the `_handleFile`
       * callback for custom `StorageEngine`s.
       */
      stream: Readable;
      /** `DiskStorage` only: Directory to which this file has been uploaded. */
      destination: string;
      /** `DiskStorage` only: Name of this file within `destination`. */
      filename: string;
      /** `DiskStorage` only: Full path to the uploaded file. */
      path: string;
      /** `MemoryStorage` only: A Buffer containing the entire file. */
      buffer: Buffer;
    }
  }
}
