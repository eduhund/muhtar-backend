import "dotenv/config";
import log from "./utils/log";
import expressServer from "./connectors/ExpressJS";
import * as mongo from "./connectors/MongoDB";
import { sendDailyTimeTrackReminder } from "./scripts";
import { setWorkdays } from "./utils/isDayOff";

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

/*
app.use("/api", api);

api.get("/timetable", async (req: Request, res: Response) => {
  const data = await getTimetable(req.query);
  res.send(data);
});

api.post("/timetable/addTime", async (req: Request, res: Response) => {
  console.log("Adding time entry:", req.body);
  await setNewTime(req.body);
  res.sendStatus(200);
});

api.get("/users", async (req: Request, res: Response) => {
  const users = await getUsers(req.query);
  res.status(200).send(users);
});

api.get("/users/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(userId);
  res.sendStatus(200);
});

api.get("/projects", (req: Request, res: Response) => {
  console.log(req.query);
  res.sendStatus(200);
});

api.get("/projects/:projectId", (req: Request, res: Response) => {
  const { projectId } = req.params;
  console.log(projectId);
  res.sendStatus(200);
});

app.get("*", (req: Request, res: Response) => {
  const filePath = path.join(__dirname, frontendPath, "index.html");

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.warn("File doesn't exist: ", filePath);
    res.status(404).send("Page not found");
  }
});

startDB();

app.listen(PORT, () => {
  console.log("Server is listening port 3000");
});
*/
