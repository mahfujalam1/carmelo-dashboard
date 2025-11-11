import React, { useContext, useEffect, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import cn from "../../../../utils/cn";
import { convertDate } from "../../../../utils/optimizationFunction";
import { Button, Form, Input } from "antd";
import { SocketContext } from "../../../../Provider/SocketContext";
function ChatMainPage() {
  const selectedUser = JSON.parse(localStorage.getItem("selectedUser"));
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);
  console.log(selectedUser);

  useEffect(() => {
    if (!socket || !selectedUser?._id) return;
    socket.emit("fetch-messages", { roomId: selectedUser._id });
    socket.on("fetch-messages", (data) => {
      console.log("get all messages=>",data)
      setMessages(data.messages || []);
    });

    return () => {
      socket.off("fetch-messages");
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (!socket) return;
    socket.on("fetch-messages", (data) => {
      console.log("new messages=>", data);
      if (
        data.senderId === selectedUser._id ||
        data.receiverId === selectedUser._id
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket]);

  const handleSendMessage = (values) => {
    if (!values?.message || !selectedUser?._id) return;
    socket.emit("message", {
      receiver: selectedUser?._id,
      message: values.message,
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: JSON.parse(localStorage.getItem("selectedUser"))._id,
        text: values.message,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="w-full flex flex-col bg-gray-50">
      {selectedUser && (
        <>
          <div className="h-[60px] border-b border-gray-300 bg-white px-3 flex items-center gap-3 shadow-sm">
            <img
              className="w-12 h-12 shadow rounded-full object-cover"
              src={selectedUser.avatar}
              alt={selectedUser.name}
            />
            <div>
              <p className="text-lg font-semibold">{selectedUser.name}</p>
              <span className="text-xs text-gray-500">Active now</span>
            </div>
          </div>

          <div className="flex-1 h-[calc(100vh-300px)] min-h-[calc(100vh-300px)] max-h-[calc(100vh-155px)] p-4 overflow-y-auto  hide-scrollbar flex flex-col gap-3 bg-gray-100">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-end gap-2",
                    msg.senderId === "u1" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.senderId !== "u1" && (
                    <img
                      className="w-8 h-8 rounded-full object-cover shadow"
                      src={msg.avatar}
                      alt=""
                    />
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm max-w-[60%] shadow",
                      msg.senderId === "u1"
                        ? "bg-[#0088ff] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    )}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={cn(
                        "text-[10px] mt-1 opacity-70",
                        msg.senderId === "u1"
                          ? "text-gray-200"
                          : "text-gray-500"
                      )}
                    >
                      {convertDate(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center h-full justify-center text-center text-gray-500">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 mb-3">
                  <FaMessage className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm">
                  Start a conversation with {selectedUser.name}
                </p>
              </div>
            )}
          </div>

          <div className="h-[60px] border-t border-gray-300  bg-white flex items-center px-3 gap-2">
            <Form onFinish={handleSendMessage} className="w-full mt-8">
              <div className="flex items-center gap-2 w-full">
                <Form.Item name="message" className="w-full mb-0">
                  <Input size="large" placeholder="Type a message..." />
                </Form.Item>
                <Form.Item className="mb-0">
                  <Button size="large" htmlType="submit">
                    Send
                  </Button>
                </Form.Item>
              </div>
            </Form>

            {/* <Form onFinish={handleSendMessage} className="w-full mt-8">
              <div className="flex items-center gap-2 w-full">
                <div className="w-full">
                  <Form.Item name="message">
                    <Input
                      size="large"
                      placeholder="Enter you message"
                      style={{ borderRadius: "0px" }}
                    />
                  </Form.Item>
                </div>
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    style={{ borderRadius: "0px" }}
                  >
                    Send
                  </Button>
                </Form.Item>
              </div>
            </Form> */}
            {/* <form
              className="flex items-center gap-2 w-full"
              onSubmit={(e) => handleSendMessage(e)}
            >
              <input
                onKeyDown={(e) => {
                  console.log(e?.key);
                  if (e.key === "Enter") {
                    alert("Message function not implemented yet");
                  }
                }}
                type="text"
                name="message"
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0088ff] text-sm"
              />
              <button
                htmlType="submit"
                className="bg-[#0088ff] text-white px-5 py-3.5 rounded-md text-sm hover:bg-[#0089ff]"
              >
                Send
              </button>
            </form> */}
          </div>
        </>
      )}
    </div>
  );
}

export default ChatMainPage;
