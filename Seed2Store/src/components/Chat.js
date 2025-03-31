import React, { useState, useContext, useEffect } from "react";
import ChatContext from "../context/chat/chatContext";

export default function ChatApp({ userId }) {
  const {
    chats,
    activeChat,
    setActiveChat,
    messages,
    sendMessage,
    setChats,
    fetchChats
  } = useContext(ChatContext);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchChats();
  },[])

  const handleChatClick = async (chat) => {
    setActiveChat(chat);
    if (chat.unreadCount > 0) {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/markAsRead/${chat.bidId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem("token") },
        });
        if (res.ok) {
          setChats((prevChats) =>
            prevChats.map((c) => (c.bidId === chat.bidId ? { ...c, unreadCount: 0 } : c))
          );
        } else {
          console.error("Failed to mark messages as read");
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleEnterSendMessage = (event) => {
    if (event.key === "Enter" && input !== "") {
        handleSendMessage()
    }
  };

  return (
    <div className="flex h-screen justify-center items-center" style={{backgroundColor : "#E4FFF0"}}>
      <div className="h-5/6 w-5/6 flex border-2 border-lime-400 rounded-xl">
        {/* Chat Switcher */}
        <div className="w-1/4 bg-white p-4 border-r border-gray-300 overflow-y-auto">
          <h2 className="text-2xl font-extrabold mb-2">CHATS</h2>
          <div className="h-[2px] bg-gray-800 w-full my-4"></div>
          {chats && chats.length > 0 ? (
            chats.map((chat, index) => (
              <div
                key={index}
                onClick={() => handleChatClick(chat)}
                className={`p-2 cursor-pointer rounded-lg flex items-center justify-between my-5 ${activeChat && activeChat.bidId === chat.bidId ? "bg-lime-400 text-gray-900" : "bg-gray-200"
                  }`}
              >
                <img
                  src={`http://localhost:5000/api/user/profilepicture/${chat.receiverId}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2 border"
                />
                <span>{chat.chatTitle}</span>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div>No chats available</div>
          )}
        </div>

        {/* Active Chat Window */}
        <div className="flex-1 flex flex-col justify-between p-4">
          <div className="h-64 overflow-y-auto p-2 border-b border-gray-300" style={{ height: "93%" }}>
            {activeChat ? (
              messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className={`flex items-end my-3 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                    {msg.senderId !== userId && (
                      <img
                        src={`http://localhost:5000/api/user/profilepicture/${msg.senderId}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2 border"
                      />
                    )}
                    <div className={`p-2 rounded-lg w-fit ${msg.senderId === userId ? "ml-auto bg-lime-400 text-gray-900" : "mr-auto bg-green-950 text-white"}`}>
                      {msg.message}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">No messages yet</div>
              )
            ) : (
              <div className="text-center">Select a chat to view messages</div>
            )}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnterSendMessage}
            />
            <button
              className="ml-2 bg-green-950 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
              onClick={handleSendMessage}
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}