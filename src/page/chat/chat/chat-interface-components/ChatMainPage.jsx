import { useContext, useEffect, useState, useRef } from "react";
import { Button, Form, Input } from "antd";
import { FaMessage } from "react-icons/fa6";
import { convertDate } from "../../../../utils/optimizationFunction";
import cn from "../../../../utils/cn";
import { useGetMessagesQuery } from "../../../../redux/features/chat/chatApis";
import { SocketContext } from "../../../../Provider/SocketContext";
import { FcAddImage } from "react-icons/fc";
import { X } from "lucide-react";

function ChatMainPage() {
  const stored = localStorage.getItem("selectedUser");
  const selectedUser = stored ? JSON.parse(stored) : null;
  const { socket } = useContext(SocketContext);

  const user2 = selectedUser?.user2 || null;
  const admin = selectedUser?.admin || null;
  const roomId = selectedUser?._id;

  const [messages, setMessages] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);
  const [form] = Form.useForm();

  const { data: fetchedMessages = [] } = useGetMessagesQuery(roomId);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch messages from DB
  useEffect(() => {
    if (fetchedMessages?.data?.length > 0) {
      const sorted = [...fetchedMessages.data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sorted);
    } else {
      setMessages([]);
    }
    setLocalMessages([]);
  }, [fetchedMessages, roomId]);

  // Socket message listener
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on("new-message", (msg) => {
      if (msg?.room !== roomId) return;
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("new-file", (msg) => {
      if (msg?.room !== roomId) return;
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("new-message");
      socket.off("new-file");
    };
  }, [socket, roomId]);

  useEffect(scrollToBottom, [messages, localMessages]);

  // Handle file input
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile({
        file: selected,
        url: URL.createObjectURL(selected),
      });
    }
  };

  // Send text or file
  const handleSendMessage = () => {
    const text = form.getFieldValue("message")?.trim();
    if (!text && !file) return;

    // local preview message
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      sender: admin,
      receiver: user2,
      createdAt: new Date().toISOString(),
      message: text || "",
      file: file ? file.url : null,
      type: file ? "file" : "text",
    };
    setLocalMessages((prev) => [...prev, tempMsg]);

    // emit
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("send-file", {
          room: roomId,
          receiver: user2._id,
          file: reader.result, // base64 or binary
          fileName: file.file.name,
          fileType: file.file.type,
        });
      };
      reader.readAsDataURL(file.file);
      setFile(null);
    } else if (text) {
      socket.emit("message", {
        room: roomId,
        receiver: user2._id,
        message: text,
      });
    }

    form.resetFields();
  };

  const allMessages = [...messages, ...localMessages];

  return (
    <div className="w-full flex flex-col bg-gray-50">
      {user2 && (
        <>
          {/* Header */}
          <div className="h-[60px] border-b border-gray-300 bg-white px-3 flex items-center gap-3 shadow-sm">
            <img
              className="w-12 h-12 shadow rounded-full object-cover"
              src={user2.avatar}
              alt={user2.fullName}
            />
            <div>
              <p className="text-lg font-semibold">{user2.fullName}</p>
              <span className="text-xs text-gray-500">Active now</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 h-[calc(100vh-300px)] p-4 overflow-y-auto hide-scrollbar flex flex-col gap-3 bg-gray-100">
            {allMessages.length > 0 ? (
              allMessages.map((msg, index) => {
                const isMyMessage = msg?.sender?._id === admin?._id;
                console.log("my messages",msg)
                return (
                  <div
                    key={msg._id || index}
                    className={cn(
                      "flex items-end gap-2",
                      isMyMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isMyMessage && (
                      <img
                        className="w-8 h-8 rounded-full object-cover shadow"
                        src={msg?.sender?.avatar}
                        alt={msg?.sender?.fullName}
                      />
                    )}
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-sm max-w-[60%] shadow",
                        isMyMessage
                          ? "bg-[#0088ff] text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      )}
                    >
                      {msg.type === "file" && msg.file ? (
                        msg.file.match(/^data:image|^blob/) ? (
                          <img
                            src={msg.file}
                            alt="uploaded"
                            className="w-40 h-auto rounded-lg mb-2"
                          />
                        ) : (
                          <a
                            href={msg.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {msg.fileName || "View File"}
                          </a>
                        )
                      ) : null}
                      {msg?.message && <p>{msg?.message}</p>}
                      <div
                        className={cn(
                          "text-[10px] mt-1 opacity-70",
                          isMyMessage ? "text-gray-200" : "text-gray-500"
                        )}
                      >
                        {convertDate(msg?.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center h-full justify-center text-center text-gray-500">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 mb-3">
                  <FaMessage className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm">
                  Start a conversation with {user2.fullName}
                </p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="h-[70px] border-t border-gray-300 bg-white flex items-center px-3 gap-2">
            <Form
              form={form}
              onFinish={handleSendMessage}
              className="w-full"
              autoComplete="off"
            >
              <div className="flex items-center gap-2 w-full relative">
                <Form.Item name="message" className="w-full mb-0">
                  <Input
                    size="large"
                    placeholder="Type a message..."
                    onPressEnter={(e) => {
                      e.preventDefault();
                      form.submit();
                    }}
                  />
                </Form.Item>

                {/* File input icon */}
                <div className="absolute right-20 flex items-center">
                  <label className="cursor-pointer flex items-center gap-1">
                    <div className="hidden">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    <FcAddImage className="h-6 w-6 text-gray-500 hover:text-blue-500" />
                  </label>
                </div>

                {/* File preview */}
                {file && (
                  <div className="absolute bottom-12 right-20 bg-white border p-2 rounded shadow">
                    <div className="flex items-center gap-2">
                      {file.file.type.startsWith("image/") ? (
                        <img
                          src={file.url}
                          alt="preview"
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 truncate max-w-[100px]">
                          {file.file.name}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <Form.Item className="mb-0">
                  <Button size="large" htmlType="submit">
                    Send
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatMainPage;
