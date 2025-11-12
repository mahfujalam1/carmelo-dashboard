import React from "react";
import ChatMainPage from "./chat-interface-components/ChatMainPage";
import ChatSiderbar from "./chat-interface-components/ChatSiderbar";

function ChatLayout() {
  const [selectedUser, setSelectedUser] = React.useState(null);
  return (
    <div>
      <div className="flex gap-1 max-h-[calc(100vh-100px)] overflow-hidden">
        <ChatSiderbar setSelectedUser={setSelectedUser} />
        <ChatMainPage selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default ChatLayout;
