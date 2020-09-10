import moment from "moment";

export abstract class DateFormatter {
  public static currentTimeToMySqlDatetime(): string {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  }
  public static mySqlDatetimeToMilliseconds(datetime: string): number {
    return moment(datetime, "YYYY-MM-DD HH:mm:ss").valueOf();
  }
}
