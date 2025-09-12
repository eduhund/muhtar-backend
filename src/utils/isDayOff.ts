//@ts-ignore
import { IsDayOffAPI } from "isdayoff";

import log from "./log";

const isDayOff = new IsDayOffAPI();

let currentMonthWorkdays: number[] = [];
let previousMonthWorkdays: number[] = [];

async function getCurrentMonthWorkdays(month: number) {
  try {
    currentMonthWorkdays = await isDayOff.month({ month });
  } catch (e) {
    currentMonthWorkdays = [];
    console.log(e);
    throw new Error("Error with getting current month workdays");
  }
}

async function getPreviousMonthWorkdays(month: number, year: number) {
  try {
    previousMonthWorkdays = await isDayOff.month({ month, year });
  } catch (e) {
    previousMonthWorkdays = [];
    log.debug(e);
    throw new Error("Error with getting previous month workdays");
  }
}

function findWorkday(todayDate: number) {
  for (let i = todayDate - 2; i >= 0; i--) {
    if (!currentMonthWorkdays[i]) return { date: i + 1, currentMonth: true };
  }
  for (let i = previousMonthWorkdays.length - 1; i >= 0; i--) {
    if (!previousMonthWorkdays[i]) return { date: i + 1, currentMonth: false };
  }
  throw new Error("Can't find previous workday");
}

export async function setWorkdays() {
  try {
    const date = new Date();
    const month = date.getMonth();
    const year = month > 0 ? date.getFullYear() : date.getFullYear() - 1;
    await getCurrentMonthWorkdays(month);
    await getPreviousMonthWorkdays(month ? month - 1 : 12, year);
    log.info("Workdays have been set");
  } catch (e) {
    log.error("Error with setting workdays");
    log.debug(e);
  }
}

export function getPreviousWorkday() {
  try {
    const today = new Date();
    const todayDate = new Date().getDate();
    const { date, currentMonth } = findWorkday(todayDate);
    const month = currentMonth ? today.getMonth() : today.getMonth() - 1;
    const year = month > 0 ? today.getFullYear() : today.getFullYear() - 1;
    return new Date(Date.UTC(year, month, date)).toISOString().split("T")[0];
  } catch (e) {
    log.error("Error with getting previous workday: ", e);
    log.debug(e);
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 1);
    const dateOnly = date.toISOString().split("T")[0];
    log.info("Yesterday was set as previous workday");
    return dateOnly;
  }
}

export async function isDayWorkday(day = Date.now()) {
  try {
    const dayDate = new Date(day);
    const date = dayDate.getDate();
    const month = dayDate.getMonth();
    const year = dayDate.getFullYear();
    return await isDayOff.date({ date, month, year });
  } catch (e) {
    log.error("Error with getting day status!");
    log.debug(e);
  } finally {
    return true;
  }
}
