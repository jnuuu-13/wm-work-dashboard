import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";

export function todayStr() {
  return format(new Date(), "yyyy-MM-dd");
}

// month: "yyyy-MM"
export function monthGrid(month: string) {
  const monthDate = new Date(`${month}-01T00:00:00`);
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end }).map((d) => ({
    date: d,
    dateStr: format(d, "yyyy-MM-dd"),
    inMonth: format(d, "yyyy-MM") === month,
  }));
  return days;
}

export function shiftMonth(month: string, delta: number) {
  const monthDate = new Date(`${month}-01T00:00:00`);
  const shifted = delta > 0 ? addMonths(monthDate, delta) : subMonths(monthDate, -delta);
  return format(shifted, "yyyy-MM");
}

export function currentMonthStr() {
  return format(new Date(), "yyyy-MM");
}
