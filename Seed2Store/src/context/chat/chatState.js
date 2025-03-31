// src/context/ChatState.js
import React, { useState, useEffect } from "react";
import ChatContext from "./chatContext";

const ChatState = ({ children, userId }) => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);

    // Fetch chat list for the user
    const fetchChats = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/chat/list", {
                headers: {
                    "auth-token" : localStorage.getItem("token")
                },
            });
            const data = await res.json();
            setChats(data.chats);
            // Set the first chat as active if none is selected
            if (data.chats.length > 0 && !activeChat) {
                setActiveChat(data.chats[0]);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    // Fetch messages for a specific chat
    const fetchMessages = async (postId, bidId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/chat/fetch/${postId}/${bidId}`, {
                headers: {
                    "auth-token" : localStorage.getItem("token")
                },
            });
            const data = await res.json();
            setMessages(data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Send a message
    const sendMessage = async (messageText) => {
        if (!activeChat) return;
        try {
            const payload = {
                receiverId: activeChat.receiverId,
                postId: activeChat.postId,
                bidId: activeChat.bidId,
                message: messageText,
            };
            const res = await fetch("http://localhost:5000/api/chat/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token" : localStorage.getItem("token")
                },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                // Optimistically update the messages
                setMessages((prev) => [
                    ...prev,
                    { senderId: userId, message: messageText, timestamp: new Date() },
                ]);
            } else {
                const errorData = await res.json();
                console.error("Error sending message:", errorData.error);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Fetch chats when the provider mounts
    useEffect(() => {
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When activeChat changes, fetch its messages
    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.postId, activeChat.bidId);
        }
    }, [activeChat]);

    // Poll for new messages every 5 seconds for the active chat
    useEffect(() => {
        let interval;
        if (activeChat) {
            interval = setInterval(() => {
                fetchMessages(activeChat.postId, activeChat.bidId);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [activeChat]);

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChat,
                setActiveChat,
                messages,
                sendMessage,
                fetchChats,
                setChats
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatState;
