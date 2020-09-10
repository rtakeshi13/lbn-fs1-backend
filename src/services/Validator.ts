export abstract class Validator {
  static validateDto(obj: any, dto: any): boolean {
    const objKeys = Object.keys(obj);
    const dtoKeys = Object.keys(dto);

    /* Check if all keys in dto are present in obj */
    if (dtoKeys.filter((item) => !objKeys.includes(item)).length) return false;

    for (let key of dtoKeys) {
      /* Check if types match */
      if (typeof obj[key] !== typeof dto[key]) return false;

      /* Check for empty strings */
      if (typeof obj[key] === "string" && !obj[key].replace(/\s+/g, ""))
        return false;

      /* Check if types match when value is an array */
      if (
        Array.isArray(obj[key]) &&
        obj[key].filter((item: any) => typeof item !== typeof dto[key][0])
          .length
      )
        return false;
    }

    return true;
  }
}
