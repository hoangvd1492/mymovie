// queue.ts
import PQueue from "p-queue";

export const streamingQueue = new PQueue({
  concurrency: 5,
});
