import * as http from "node:http";
import { create } from "@bufbuild/protobuf";
import type { ConnectRouter } from "@connectrpc/connect";
import { connectNodeAdapter } from "@connectrpc/connect-node";
import { createValidateInterceptor } from "@connectrpc/validate";
import { TaskService, TaskSchema, type Task } from "../gen/tasks/v1/tasks_pb.js";

const tasks: Task[] = [];

const routes = (router: ConnectRouter) =>
  router.service(TaskService, {
    createTask: (req) => {
      const task = create(TaskSchema, { id: crypto.randomUUID(), title: req.title });
      tasks.push(task);
      return { task };
    },
    listTasks: () => ({ tasks }),
  });

http
  .createServer(connectNodeAdapter({ routes, interceptors: [createValidateInterceptor()] }))
  .listen(8080, () => console.log("listening on :8080"));
