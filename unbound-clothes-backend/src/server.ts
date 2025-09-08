import https from "https";
import { portConfig } from "./config/config";
import app from "./app";

https.createServer(portConfig.certs, app).listen(portConfig.port, () => {
    console.log(`Server is running on port ${portConfig.port}`);
})