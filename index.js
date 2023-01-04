import cluster from "node:cluster";
import { cpus } from "node:os";
import express from "express";

const PORT = 3000;
const app = express();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const numCPUs = cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  setInterval(() => {
    console.log("Primary is running the routine");
  }, 5000);
} else {
  app.get("/", (req, res) => {
    // Simulação de uma tarefa pesada
    for (let i = 0; i < 10_000_000_000; i++);

    res.send("Hello World! " + process.pid);
  });

  app.get("/test", (req, res) => {
    res.send("Teste");
  });

  // As requisições são distribuídas entre os clusters, que compartilham a mesma porta
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
