import express from "express";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { createBareServer } from "@tomphttp/bare-server-node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const app = express();
const server = http.createServer();
const bareServer = createBareServer("/b/");
const port = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDir));

app.get("/health", (_req, res) => res.json({ ok: true }));

// A normal redirect is a dependable fallback when a destination refuses iframes.
app.get("/go", (req, res) => {
  const value = typeof req.query.url === "string" ? req.query.url : "";
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("unsupported protocol");
    res.redirect(url.toString());
  } catch {
    res.status(400).send("A valid http(s) URL is required.");
  }
});

app.get(["/", "/index"], (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) bareServer.routeRequest(req, res);
  else app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) bareServer.routeUpgrade(req, socket, head);
  else socket.destroy();
});

server.listen(port, "0.0.0.0", () => {
  console.log(`FunGames listening on port ${port}`);
});

function shutdown() {
  bareServer.close();
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;
