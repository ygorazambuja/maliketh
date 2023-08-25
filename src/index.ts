import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import genSchema from "generate-schema";
import path from "path";

import { compile } from "json-schema-to-typescript";
import { writeFileSync, mkdirSync } from "fs";
import { AxiosRequestConfig } from "axios";

export class Maliketh {
  #axios: AxiosInstance;
  #active = false;
  private options: CreateAxiosDefaults;

  constructor(options: CreateAxiosDefaults = {}) {
    this.#active = process.env.MALIKETH_ACTIVE === "true";
    this.options = options;
    this.#axios = axios.create(this.options);
  }

  create() {}

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const {
      data,
      config: { baseURL },
    } = await this.#axios.get<T>(url, config);

    if (!this.#active) {
      return data;
    }

    await this.compileInterface(baseURL, url, data);

    return data;
  }

  public async post<T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const {
      data,
      config: { baseURL },
    } = await this.#axios.post<T>(url, payload, config);

    if (!this.#active) {
      return data;
    }

    await this.compileInterface(baseURL, url, data);

    return data;
  }

  public async put<T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const {
      data,
      config: { baseURL },
    } = await this.#axios.put<T>(url, payload, config);

    if (!this.#active) {
      return data;
    }

    await this.compileInterface(baseURL, url, data);

    return data;
  }

  public getAxios(): AxiosInstance {
    return this.#axios;
  }

  public getOptions(): CreateAxiosDefaults {
    return this.options;
  }

  public setOptions(options: CreateAxiosDefaults): void {
    this.options = options;
  }

  public setHeader(key: string, value: string): void {
    this.#axios.defaults.headers.common[key] = value;
  }

  public isActive(): boolean {
    return this.#active;
  }

  getInterfaceNameBasedOnUrl(url: string): string {
    const urlObj = new URL(url);

    const pathParts = urlObj.pathname
      .split("/")
      .filter((part) => part.trim() !== "");

    const capitalizedParts = pathParts.map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1)
    );

    const name = capitalizedParts.join("");

    const ifHasNumber = /\d/.test(name);

    if (!ifHasNumber) {
      return "I" + name;
    }

    const removeLastNumber = name.slice(0, -1);
    const removeLastChar = removeLastNumber.slice(0, -1);

    return "I" + removeLastChar;
  }

  saveInterfaceOnDisk(
    folderPath: string,
    interfaceName: string,
    content: string
  ): void {
    writeFileSync(`${folderPath}/${interfaceName}.ts`, content);
  }

  createFolderPathBasedOnUrl(url: string): string {
    const urlObj = new URL(url);

    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    const domainParts = hostname.split(".");

    // @ts-ignore
    const pathParts = pathname.split("/").filter((part) => isNaN(part) && part);

    const folderStructure = [...domainParts, ...pathParts].join("/");

    const folderPath = path.join(__dirname, `./interfaces/${folderStructure}`);

    mkdirSync(folderPath, { recursive: true });

    return folderPath;
  }

  async compileInterface(baseURL: string = "", url: string, data: any) {
    const interfaceName = this.getInterfaceNameBasedOnUrl(baseURL + url);
    const schema = genSchema.json("", data);
    const result = await compile(schema, interfaceName, {
      bannerComment: "",
      format: false,
    });

    const folder = this.createFolderPathBasedOnUrl(baseURL + url);
    this.saveInterfaceOnDisk(folder, interfaceName, result);
  }
}
