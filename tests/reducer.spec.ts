// The reducer is a pure function: the same state, event and stamp always give the
// same next state and the same operations, and every id and time in them comes
// from the stamp. This runs in plain Node and never starts Electron:
//
//   yarn test:reducer
import { expect, test } from "@playwright/test";
import type { ReducerEvent } from "../packages/renderer/src/store/events";
import { reducer } from "../packages/renderer/src/store/reducer";
import type { TransactionState } from "../packages/renderer/src/store/structure";

const state = (defaultQueue: boolean): TransactionState =>
  ({
    transactions: {
      7: {
        id: 7,
        status: "PENDING",
        jobs: [
          { id: 1, status: "PENDING" },
          { id: 2, status: "PENDING" },
        ],
      },
    },
    printQueues: {
      "Office Printer": { name: "Office Printer", default: defaultQueue, items: [] },
    },
  }) as unknown as TransactionState;

const stamp = { eventId: "event-a", at: "2026-01-01T10:00:00.000Z" };
const print: ReducerEvent = {
  type: "user:print:transaction",
  transactionId: 7,
  queueName: "Office Printer",
};

test("the same input gives the same output", () => {
  const first = reducer(state(true), print, stamp);
  const second = reducer(state(true), print, stamp);
  expect(second).toEqual(first);
});

test("ids and times come from the stamp", () => {
  const [next] = reducer(state(true), print, stamp);
  expect(next.printQueues["Office Printer"].items).toEqual([
    { id: "event-a:1", transactionId: 7, jobId: 1, queuedAt: stamp.at },
    { id: "event-a:2", transactionId: 7, jobId: 2, queuedAt: stamp.at },
  ]);

  const later = { eventId: "event-b", at: "2026-01-01T10:05:00.000Z" };
  const [other] = reducer(state(true), print, later);
  expect(other.printQueues["Office Printer"].items.map((i) => [i.id, i.queuedAt])).toEqual([
    ["event-b:1", later.at],
    ["event-b:2", later.at],
  ]);
});

test("the input state is never changed", () => {
  const before = state(true);
  const copy = structuredClone(before);
  reducer(before, print, stamp);
  expect(before).toEqual(copy);
});

test("toasts and log lines come back as operations", () => {
  const [, operations] = reducer(
    state(false),
    { type: "user:get-qr-code:success", path: "/tmp/qr.pdf", printIntent: true },
    stamp,
  );
  expect(operations).toEqual([
    {
      operationId: "event-a.0",
      type: "notify-user",
      level: "error",
      message: "Please select a default printer first. Then try again.",
    },
  ]);
});
