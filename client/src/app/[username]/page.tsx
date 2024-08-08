"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import UserItem from '@/components/useritem';

export default function Usernamepage() {
  const router = useRouter();

  interface UserItem {
    username: string | null;
  }

  const handleProfileClick = () => {
    router.push(`/profile/${user}?username=${user}`);
    // alert("clicked")
    // if (user) {
    //   router.push(`/profile/${user}`);
    // }
    
  };

  const searchParams = useSearchParams();
  const user = searchParams.get('username');
  return (
    <div style={{ display: "flex" }}>
      <div className='friends' style={{ height: "100vh", width: "27%", borderRight: "1px solid white" }}>
        <div style={{ backgroundColor: "red", padding: "5% 0", textAlign: "center", position: "relative" }}>
          {user && (
            <div onClick={handleProfileClick} style={{ cursor: "pointer", width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "blue", color: "white", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "20px" }}>
              {user.charAt(0)}
            </div>
          )}
          Chat Room
        </div>
        {/* <h1 >friends section</h1>
        <UserItem username={user} />*/}
        <UserItem username="John" /> 
      </div>
      <div className="chats" style={{ height: "100vh", width: "73%", borderLeft: "1px solid white" }}>
        {/* <h1>chat section</h1> */}
      </div>
    </div>
  )
}