"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import UserItem from '@/components/useritem';
import LogOutBtn from '@/components/LogOutBtn';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface Friend {
  user_id: string;
  friend_id: string;
}

interface ChatMessage {
  Sender: string;
  Recipient: string;
  Message: string;
  DtTime: string;
}

export default function Usernamepage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get('username');
  const [isMobile, setIsMobile] = useState(false);
  const [list, setList] = useState<Friend[]>([]);
  const [newUID, setNewUID] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]); 
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProfileClick = () => {
    router.push(`/profile/${user}?username=${user}`);
  };

  const handleNewUID = async () => {
    try {
      const response = await fetch(`http://localhost:8080/add/${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUID }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add friend. HTTP status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDisplayMessage("Friend added successfully!");
        await fetchFriendList();
        setNewUID('');
      } else if (data.message === 'Friendship already exists') {
        setDisplayMessage("Friendship already exists.");
      } else {
        setDisplayMessage("Failed to add friend. Please check the UID.");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setDisplayMessage("Failed to add friend. Please check the UID.");
    }
  };

  useEffect(() => {
    if (displayMessage) {
      const timer = setTimeout(() => {
        setDisplayMessage('');
      }, 2400);

      return () => clearTimeout(timer);
    }
  }, [displayMessage]);

  const fetchFriendList = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/add/${user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setList(data.result || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friend list:", error);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFriendList();
    }
  }, [user, fetchFriendList]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedUsername(null);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const closeChat = () => {
    setSelectedUsername(null);
  };

  const friendsStyle = {
    height: "90vh",
    width: selectedUsername && isMobile ? "0%" : isMobile ? "100vw" : "28%",
    borderRight: selectedUsername && isMobile ? "none" : "1px solid white",
    display: selectedUsername && isMobile ? "none" : "block",
    overflow: 'auto'
  };

  const chatsStyle = {
    height: "100vh",
    width: selectedUsername && isMobile ? "100vw" : isMobile ? "0%" : "72%",
    borderLeft: selectedUsername && isMobile ? "none" : "1px solid white",
    display: selectedUsername && isMobile ? "block" : isMobile ? "none" : "block",
  };

  const footerStyle: React.CSSProperties = {
    height: '6vh',
    width: isMobile ? "100vw" : "28%",
    position: "absolute",
    bottom: '2%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0 10px',
  };

  const fetchChat = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/chats/${user}/${selectedUsername}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setChat(data.messages || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, [user]);

  useEffect(() => {
    if (selectedUsername) {
      fetchChat();
    }
  }, [selectedUsername, fetchChat]);

  const handleMessageSent = async () => {
    const messageObj = {
      Sender: user!,
      Message: newMessage.trim(),
      DtTime: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await fetch(`http://localhost:8080/chats/${user}/${selectedUsername}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageObj),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message. HTTP status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchChat();
        setNewMessage('');
      } else {
        console.error("Error sending message:");
      }

    } catch (error) {
      console.error("Error sending message:", error);
    }
  }


  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      <div className='friends' style={friendsStyle}>
        <div style={{ backgroundColor: "red", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5% 2%", textAlign: "center", position: "relative" }}>
          {user && (
            <div
              onClick={handleProfileClick}
              style={{ cursor: "pointer", width: "35px", height: "35px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%", backgroundColor: "blue", color: "white", fontSize: "20px" }}>
              {user.charAt(0).toUpperCase()}
            </div>
          )}

          <div style={{ flex: 1, textAlign: "center", fontSize: "18px" }}>Chat Room</div>

          <Link href='/auth/login'>
            <LogOutBtn />
          </Link>
        </div>

        {displayMessage && <p style={{ color: 'white', textAlign: 'center' }}>{displayMessage}</p>}

        {isLoading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>Loading friends...</p>
        ) : (
          list.length > 0 ? (
            list.map((element) => (
              <UserItem key={element.friend_id} username={element.friend_id} onClick={() => setSelectedUsername(element.friend_id)} />
            ))
          ) : (
            <p style={{ color: 'white', textAlign: 'center' }}>No friends found.</p>
          )
        )}

        <footer style={footerStyle}>
          <Input type="text" placeholder='Add friend using UID' className="bg-black w-full" style={{ color: 'white', fontSize: '15px', border: '0.5px solid white' }} value={newUID} onChange={(e) => setNewUID(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { handleNewUID(); } }} />
          <Label htmlFor="newUID" style={{ color: 'white' }}></Label>
          <button type="button" onClick={handleNewUID} style={{ border: '1px solid white', padding: '1%' }}>Add</button>
        </footer>
      </div>

      <div className="chats" style={chatsStyle}>
        {selectedUsername ? (
          <>
            <div style={{ display: "flex", alignItems: 'center', backgroundColor: 'violet', justifyContent: 'space-between', paddingRight: '1%' }}>
              <h1 style={{ color: 'white', textAlign: 'center', padding: '20px', fontSize: '20px' }}>
                {selectedUsername}
              </h1>
              <FontAwesomeIcon icon={faXmark} fontSize={'20px'} style={{ cursor: 'pointer' }} onClick={closeChat} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {chat.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.Sender === user ? 'right' : 'left', marginBottom: '10px' }}>
                  <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', backgroundColor: msg.Sender === user ? 'lightblue' : 'lightgray' }}>
                    <p style={{ margin: 0 }}>
                      {msg.Message ? msg.Message : "No message found"}
                    </p>
                  </div>
                </div>

              ))}
            </div>

            <div style={{ padding: '10px', display: 'block', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', bottom: "0%", width: '71.5vw' }}>
              <Input type="text" placeholder='Type your message...' className="bg-black w-full" style={{ color: 'white', fontSize: '15px', border: '0.5px solid white' }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { handleMessageSent(); } }} />
            </div>
          </>
          
        ) : (
          <h1 style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            Select a friend to start chatting
          </h1>
        )}
      </div>

    </div>
  );
}
