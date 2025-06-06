"use server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import api from "./api";
// import { Client } from "@aws-sdk/types"; // Not needed, can be removed

class AWSService {
  awsClient!: S3Client;
  REGION: string;
  BUCKET: string;
  AWS_ACCESSKEYID: string;
  AWS_SECRETACCESSKEY: string;
  private static _instance: AWSService;
  MaxFileSize: number;

  private constructor() {
    this.REGION = process.env.NEXT_PUBLIC_AWS_REGION || "";
    this.BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "";
    this.AWS_ACCESSKEYID = process.env.NEXT_PUBLIC_AWS_ACCESSKEYID || "";
    this.AWS_SECRETACCESSKEY =
      process.env.NEXT_PUBLIC_AWS_SECRETACCESSKEY || "";
    this.MaxFileSize = 4 * 1024 * 1024;
    this.init();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private init() {
    try {
      this.awsClient = new S3Client({
        region: this.REGION,
        credentials: {
          accessKeyId: this.AWS_ACCESSKEYID,
          secretAccessKey: this.AWS_SECRETACCESSKEY,
        },
      });
    } catch (error) {
      console.error("Error on setup AWS: ", error);
    }
  }

  private computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  private generateFileName = (bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  public async generatePreSignedURL(file: File, folder?: string) {
    try {
      let finalFolder;
      const fileName = this.generateFileName();
      if (!folder) {
        finalFolder = fileName;
      } else {
        finalFolder = `${folder}/${fileName}`;
      }
      const checksum = await this.computeSHA256(file);

      const apiResponse = await api.post("/documents/generate-s3-url", {
        checksum,
        fileType: file.type,
        fileSize: file.size,
        folder: finalFolder,
      });
      if (apiResponse.status !== 200) {
        throw new Error("Error on get AWS URL");
      }
      return apiResponse.data.url;
    } catch (error) {
      console.log(error);
    }
  }

  public async uploadFileToAWS(url: string, file: File) {
    try {
      if (file.size > this.MaxFileSize) {
        return false;
      }
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "Access-Control-Allow-Credentials": "true",
        },
        body: file,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async downloadFileFromAWS(key: string): Promise<string | undefined> {
    try {
      const parsedUrl = new URL(key);

      const parsedKey = decodeURIComponent(parsedUrl.pathname.slice(1)); // remove leading '/'
      console.log("Key decodificada: ", parsedKey);
      const params = {
        Bucket: this.BUCKET,
        Key: parsedKey,
        Expires: 360,
      };
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(this.awsClient, command, {
        expiresIn: 2 * 60,
      });
      console.log("Key gerada: ", key);
      console.log("URL gerada: ", url);
      return url;
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
}

export default AWSService;
