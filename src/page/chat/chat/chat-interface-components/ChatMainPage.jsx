import { useContext, useEffect, useState, useRef } from "react";
import { Button, Form, Input } from "antd";
import { FaMessage } from "react-icons/fa6";
import { convertDate } from "../../../../utils/optimizationFunction";
import cn from "../../../../utils/cn";
import {
  useGetMessagesQuery,
  useSendFileMutation,
} from "../../../../redux/features/chat/chatApis";
import { SocketContext } from "../../../../Provider/SocketContext";
import { FcAddImage } from "react-icons/fc";
import { X } from "lucide-react";
import { ImageModal } from "../../../../component/ui/Modal/ViewMessageImageModal";

function ChatMainPage() {
  const stored = localStorage.getItem("selectedUser");
  const [sendFileMessage] = useSendFileMutation();
  const selectedUser = stored ? JSON.parse(stored) : null;
  const { socket } = useContext(SocketContext);
  const [files, setFiles] = useState([]); // Stores the selected files
  const user2 = selectedUser?.user2 || null;
  const admin = selectedUser?.admin || null;
  const roomId = selectedUser?._id;

  const [messages, setMessages] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const chatEndRef = useRef(null);
  const [form] = Form.useForm();

  // Image modal states
  const [modalImages, setModalImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: fetchedMessages = [] } = useGetMessagesQuery(roomId);
  console.log(fetchedMessages);

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

    return () => {
      socket.off("new-message");
    };
  }, [socket, roomId]);

  useEffect(scrollToBottom, [messages, localMessages]);

  // Handle file input
  const handleFileChange = (e) => {
    const selected = e.target.files;
    if (selected) {
      const fileArray = Array.from(selected).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  // Remove file
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Send text or file
  const handleSendMessage = async () => {
    const text = form.getFieldValue("message")?.trim();
    if (!text && files.length === 0) return;

    // Local preview message
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      sender: admin,
      receiver: user2,
      createdAt: new Date().toISOString(),
      message: text || "",
      file: files.length > 0 ? files[0].url : null,
      type: files.length > 0 ? "file" : "text",
    };
    setLocalMessages((prev) => [...prev, tempMsg]);

    // Create FormData for sending file
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("receiver", user2._id);
      formData.append("message", text);

      // Append files to formData
      files.forEach((file) => {
        formData.append("files", file.file);
      });

      try {
        await sendFileMessage(formData);
        setFiles([]);
      } catch (error) {
        console.error("Error sending file message:", error);
      }
    } else if (text) {
      // If no file, just send the text message via socket
      socket.emit("message", {
        room: roomId,
        receiver: user2._id,
        message: text,
      });
    }

    form.resetFields();
  };

  // Image modal functions
  const openImageModal = (images, index) => {
    setModalImages(images);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setModalImages(null);
    setCurrentImageIndex(0);
  };

  // Render images function
  const renderImages = (msg) => {
    const files = msg.files;
    if (!files || files.length === 0) return null;

    const imageFiles = files.filter(
      (file) =>
        typeof file === "string" &&
        (file.match(/^data:image/) ||
          file.match(/^blob/) ||
          file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
          file.includes("/uploads/"))
    );

    if (imageFiles.length === 0) return null;

    // Single image
    if (imageFiles.length === 1) {
      return (
        <div
          className="mb-2 cursor-pointer"
          onClick={() => openImageModal(imageFiles, 0)}
        >
          <img
            src={imageFiles[0]}
            alt="uploaded"
            className="rounded-lg max-w-[250px] max-h-[250px] object-cover hover:opacity-90 transition-opacity"
          />
        </div>
      );
    }

    // Multiple images - grid layout
    const gridClass =
      imageFiles.length === 2
        ? "grid-cols-2"
        : imageFiles.length === 3
        ? "grid-cols-3"
        : "grid-cols-2";

    return (
      <div className={`grid ${gridClass} gap-1 mb-2 max-w-[300px]`}>
        {imageFiles.map((file, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
            onClick={() => openImageModal(imageFiles, idx)}
          >
            <img
              src={file}
              alt={`uploaded-${idx}`}
              className="w-full object-cover"
              style={{ height: imageFiles.length <= 2 ? "150px" : "100px" }}
            />
          </div>
        ))}
      </div>
    );
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
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 h-[calc(100vh-300px)] p-4 overflow-y-auto hide-scrollbar flex flex-col gap-3 bg-gray-100">
            {allMessages.length > 0 ? (
              allMessages.map((msg, index) => {
                console.log(msg);
                const isMyMessage = msg?.sender?._id === admin?._id;
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
                      {/* Render images if files array exists */}
                      {msg.files && msg.files.length > 0 && renderImages(msg)}

                      {/* Old file handling - keep for backward compatibility */}
                      {msg.type === "file" && msg.file && !msg.files ? (
                        msg.file.match(/^data:image|^blob/) ? (
                          <img
                            src={msg.file}
                            alt="uploaded"
                            className="w-40 h-auto rounded-lg mb-2 cursor-pointer"
                            onClick={() => openImageModal([msg.file], 0)}
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

                      {/* Render message text if exists */}
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
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </div>
                    <FcAddImage className="h-6 w-6 text-gray-500 hover:text-blue-500" />
                  </label>
                </div>

                {/* File preview */}
                {files.length > 0 && (
                  <div className="absolute bottom-12 right-20 bg-white border p-2 rounded shadow">
                    <div className="flex items-center gap-2">
                      {files?.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={file.url}
                            alt="preview"
                            className="w-16 h-16 rounded object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
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

      {/* Image Modal */}
      {modalImages && (
        <ImageModal
          images={modalImages}
          currentIndex={currentImageIndex}
          onClose={closeImageModal}
        />
      )}
    </div>
  );
}

export default ChatMainPage;
