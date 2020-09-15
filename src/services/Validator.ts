export abstract class Validator {
  static validateDto(obj: any, dto: any): void {
    const objKeys = Object.keys(obj);
    const dtoKeys = Object.keys(dto);

    /* Check if all keys in dto are present in obj */
    if (dtoKeys.filter((item) => !objKeys.includes(item)).length) {
      throw new Error("Parameter missing");
    }

    for (let key of dtoKeys) {
      /* Check if types match */
      if (typeof obj[key] !== typeof dto[key]) {
        throw new Error("Parameter type mismatch");
      }

      /* Check for empty strings */
      if (typeof obj[key] === "string" && !obj[key].replace(/\s+/g, "")) {
        throw new Error("Parameter missing");
      }

      /* Check if types match when value is an array */
      if (Array.isArray(dto[key]) !== Array.isArray(obj[key])) {
        throw new Error("Parameter type mismatch");
      } else if (
        Array.isArray(dto[key]) &&
        obj[key].filter((item: any) => typeof item !== typeof dto[key][0])
          .length
      ) {
        throw new Error("Parameter type mismatch");
      }
    }
  }

  static validateString(str: any): void {
    /* Check for string type */
    if (typeof str !== "string" || str.replace(/\s+/, "")) {
      throw new Error("Parameter missing or invalid");
    }
  }
}
