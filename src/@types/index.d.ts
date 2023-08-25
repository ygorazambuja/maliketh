declare module "generate-schema" {
  // If you know some methods or properties of the module, you can define them here.
  // For example:
  // function someMethod(arg1: Type1, arg2: Type2): ReturnType;

  // If you don't know the exact types or just want to allow any type:
  // var anyPartOfTheModule: any;

  // Export the methods, variables, or types that you've declared above.
  // export { someMethod, anyPartOfTheModule };

  // For now, as we don't have any specific details:
  function json(schema: string, data: any): any;
}
