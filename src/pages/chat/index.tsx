import { FC, useRef, useState } from "react";
import type { Chat } from "src/server/router";
import { trpc } from "src/utils/trpc";

const ChatList: FC = () => {
  const formId = useRef<HTMLInputElement>(null);
  const formTitle = useRef<HTMLInputElement>(null);
  const formMessage = useRef<HTMLInputElement>(null);
  const initChatList = trpc.useQuery(["chatList"]);
  const [chatList, setChatList] = useState<Chat[]>(
    initChatList.data?.chatList ?? []
  );

  trpc.useSubscription(["onAddChatMessage", undefined], {
    onNext(newChat) {
      setChatList((old) => [...old, newChat]);
    },
  });

  const addChat = trpc.useMutation(["addChat"]);

  const handleSubmit = () => {
    if (!formTitle.current?.value) {
      alert("title is empty");
      return;
    }
    if (!formMessage.current?.value) {
      alert("message is empty");
      return;
    }
    addChat.mutate({
      id: formId.current?.value,
      title: formTitle.current?.value,
      message: formMessage.current?.value,
    });
  };
  if (initChatList.isFetching) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ul>
        {chatList.map((chat) => (
          <li key={chat.id}>
            ID: {chat.id}
            <br />
            title: {chat.title}
            <br />
            message: {chat.message}
            <br />
          </li>
        ))}
      </ul>
      <input ref={formId} placeholder="id" />
      <input ref={formTitle} placeholder="title" />
      <input ref={formMessage} placeholder="message" />
      <button onClick={handleSubmit}>送信</button>
    </>
  );
};

export default ChatList;
