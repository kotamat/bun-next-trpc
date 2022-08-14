import * as trpc from "@trpc/server";
import { z } from "zod";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";

const ee = new EventEmitter();
export type Chat = {
  id: string;
  title: string;
  message: string;
};

const chatList: Chat[] = [];
export const appRouter = trpc
  .router()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}!`,
      };
    },
  })
  .query("chatList", {
    resolve({ ctx }) {
      return {
        chatList,
      };
    },
  })
  .subscription("onAddChatMessage", {
    resolve({ ctx }) {
      return new trpc.Subscription<Chat>((emit) => {
        const onAdd = (chat: Chat) => {
          emit.data(chat);
        };

        ee.on("add", onAdd);

        return () => {
          ee.off("add", onAdd);
        };
      });
    },
  })
  .mutation("addChat", {
    input: z.object({
      id: z.string().nullish(),
      title: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      const post = input.id
        ? { ...input, id: input.id }
        : { ...input, id: uuidv4() };
      chatList.push(post);
      ee.emit("add", post);
      return post;
    },
  });
