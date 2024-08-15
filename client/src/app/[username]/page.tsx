"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import UserItem from '@/components/useritem';
import LogOutBtn from '@/components/LogOutBtn';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Friend {
  user_id: string;
  friend_id: string;
}

export default function Usernamepage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get('username');
  const [isMobile, setIsMobile] = useState(false);
  const [list, setList] = useState<Friend[]>([]);
  const [newUID, setNewUID] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const friendsStyle = {
    height: "100vh",
    width: isMobile ? "100vw" : "28%",
    borderRight: isMobile ? "none" : "1px solid white"
  };

  const chatsStyle = {
    height: "100vh",
    width: isMobile ? "0%" : "72%",
    borderLeft: isMobile ? "none" : "1px solid white",
    display: isMobile ? "none" : "block"
  };

  const footerStyle: React.CSSProperties = {
    width: isMobile ? "100vw" : "28%",
    position: "absolute",
    bottom: '2%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0 10px',
  };

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
      console.log("API response data:", data);

      if (data.success) {
        // After successfully adding a friend, fetch the updated friend list
        await fetchFriendList();
        // Clear the input field
        setNewUID('');
      } else {
        alert("Failed to add friend. Please check the UID.");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("Failed to add friend. Please try again.");
    }
  };


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
      console.log("Fetched friend list:", data);

      setList(data.result || []);  // Set the list to an empty array if data.result is undefined
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

        {isLoading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>Loading friends...</p>
        ) : (
          list.length > 0 ? (
            list.map((element) => (
              <UserItem key={element.friend_id} username={element.friend_id} />
            ))
          ) : (
            <p style={{ color: 'white', textAlign: 'center' }}>No friends found.</p>
          )
        )}

        <footer style={footerStyle}>
          <Input type="text" placeholder='Add friend using UID' className="bg-black w-full" style={{ color: 'white', fontSize: '15px', border: '0.5px solid white' }} value={newUID} onChange={(e) => setNewUID(e.target.value)} />
          <Label htmlFor="newUID" style={{ color: 'white' }}></Label>
          <button type="button" onClick={handleNewUID} style={{ border: '1px solid white', padding: '1%' }}>Add</button>
        </footer>
      </div>

      <div className="chats" style={chatsStyle}>
        <h1></h1>
      </div>
    </div>
  );
}