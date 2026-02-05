import "dotenv/config";
import log from "./utils/log";
import expressServer from "./connectors/ExpressJS";
import * as mongo from "./connectors/MongoDB";
//import { sendDailyTimeTrackReminder } from "./scripts";
//import { setWorkdays } from "./utils/isDayOff";

(async () => {
  try {
    await expressServer.start();
    await mongo.connect();
    //await setWorkdays();
    log.info("All systems running. Let's rock!");
    //sendDailyTimeTrackReminder();
  } catch (e) {
    log.error("Hewston, we have a problem!");
    log.debug(e);
    process.exit(1);
  }
})();
