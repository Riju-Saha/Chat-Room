"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import UserItem from '@/components/useritem';
import LogOutBtn from '@/components/LogOutBtn';

export default function Usernamepage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get('username');
  const [isMobile, setIsMobile] = useState(false);

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

  const friendsStyle = {
    height: "100vh",
    width: isMobile ? "100vw" : "28%",
    borderRight: isMobile ? "none" : "1px solid white",
  };

  const chatsStyle = {
    height: "100vh",
    width: isMobile ? "0%" : "72%",
    borderLeft: isMobile ? "none" : "1px solid white",
    display: isMobile ? "none" : "block", // Hide completely on mobile
  };

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

          <div style={{ flex: 1, textAlign: "center", fontSize: "20px" }}>Chat Room</div>

          <Link href='/auth/login'>
            <LogOutBtn />
          </Link>
        </div>

        <UserItem username="John" />
      </div>

      <div className="chats" style={chatsStyle}>
        <h1></h1>
      </div>
    </div>
  )
}
