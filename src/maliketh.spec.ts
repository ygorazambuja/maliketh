import { describe, expect, it } from "vitest";
import path from "path";
import { Maliketh } from ".";

describe("Maliketh", () => {
  it("should return a axios instance", () => {
    const maliketh = new Maliketh();
    expect(maliketh.getAxios()).toBeDefined();
    // @ts-ignore
    expect(maliketh.axios).not.toBeDefined();
  });

  it("should maliketh be deactived", () => {
    const maliketh = new Maliketh();
    expect(maliketh.isActive()).toBe(false);
    // @ts-ignore
    expect(maliketh.active).not.toBeDefined();
  });

  it("should maliketh be active", () => {
    process.env.MALIKETH_ACTIVE = "true";
    const maliketh = new Maliketh();
    expect(maliketh.isActive()).toBe(true);
    // @ts-ignore
  });

  it("should maliketh get to be typed", async () => {
    process.env.MALIKETH_ACTIVE = "true";
    const maliketh = new Maliketh();

    const response = await maliketh.get<{
      userId?: number;
      id?: number;
      title?: string;
      completed?: boolean;
    }>("https://jsonplaceholder.typicode.com/todos/1");

    expect(response).toBeDefined();
  });

  it("should create a folder path based on url", async () => {
    const maliketh = new Maliketh();
    const folderPath = maliketh.createFolderPathBasedOnUrl(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    const expectedFolderPath = path.join(
      __dirname,
      "./interfaces/jsonplaceholder/typicode/com/todos"
    );

    expect(folderPath).toBe(expectedFolderPath);
  });

  it("should create a interface for a given url", async () => {
    const maliketh = new Maliketh();
    const response = await maliketh.get(
      "https://jsonplaceholder.typicode.com/posts"
    );

    expect(response).toBeDefined();

    const interfaceName = maliketh.getInterfaceNameBasedOnUrl(
      "https://jsonplaceholder.typicode.com/posts"
    );

    expect(interfaceName).toBe("IPosts");
  });
});
