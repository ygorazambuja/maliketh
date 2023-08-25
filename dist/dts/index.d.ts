import { AxiosInstance, CreateAxiosDefaults } from "axios";
import { AxiosRequestConfig } from "axios";
export declare class Maliketh {
    #private;
    private options;
    constructor(options?: CreateAxiosDefaults);
    create(): void;
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, payload: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, payload: any, config?: AxiosRequestConfig): Promise<T>;
    getAxios(): AxiosInstance;
    getOptions(): CreateAxiosDefaults;
    setOptions(options: CreateAxiosDefaults): void;
    setHeader(key: string, value: string): void;
    isActive(): boolean;
    getInterfaceNameBasedOnUrl(url: string): string;
    saveInterfaceOnDisk(folderPath: string, interfaceName: string, content: string): void;
    createFolderPathBasedOnUrl(url: string): string;
    compileInterface(baseURL: string | undefined, url: string, data: any): Promise<void>;
}
