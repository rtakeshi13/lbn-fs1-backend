import * as moment from "moment";

export class DateFormatter {
  public nowToMySqlDatetime(): string {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  }
  public mySqlDatetimeToMilliseconds(datetime: string): number {
    return moment(datetime, "YYYY-MM-DD HH:mm:ss").valueOf();
  }
}
