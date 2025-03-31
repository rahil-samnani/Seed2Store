import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PostState from './context/post/postState';
import CommentState from './context/comment/commentState'
import UserState from './context/user/userState';
import { BrowserRouter as Router } from 'react-router-dom';
import BidState from './context/bid/bidState';
import ChatState from './context/chat/chatState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChatState userId={localStorage.getItem("userId")}>
    <BidState>
      <UserState>
        <CommentState>
          <PostState>
            <Router>
              <React.StrictMode>
                <App />
              </React.StrictMode>
            </Router>
          </PostState>
        </CommentState>
      </UserState>
    </BidState>
  </ChatState>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
