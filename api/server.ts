/**
 * Local server entry, used by nodemon + tsx during development.
 */
import app from "./app";

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Lingo Atlas API ready on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

export default app;
