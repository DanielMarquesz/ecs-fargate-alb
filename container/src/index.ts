import * as express from "express";
import * as os from "os";

const app = express();

app.get("/", (request, response) => {
  response.send(`Hi! ECS task ${os.hostname()} is reporting back!`)
})

const PORT = 80
app.listen(PORT, () => console.log(`The app is listening on port ${PORT}.`));