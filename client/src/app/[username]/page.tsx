"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import UserItem from '@/components/useritem';
import LogOutBtn from '@/components/LogOutBtn';

export default function Usernamepage() {
  const router = useRouter();

  interface UserItem {
    username: string | null;
  }

  const handleProfileClick = () => {
    router.push(`/profile/${user}?username=${user}`);
  };

  const searchParams = useSearchParams();
  const user = searchParams.get('username');
  return (
    <div style={{ display: "flex" }}>

      <div className='friends' style={{ height: "100vh", width: "28%", borderRight: "1px solid white" }}>
        
        <div style={{ backgroundColor: "red", display: "flex", justifyContent: "space-around", padding: "5% 0", textAlign: "center", position: "relative" }}>

          {user && (
            <div onClick={handleProfileClick} style={{ cursor: "pointer", width: "35px", height: "35px",  alignItems: "center", borderRadius: "50%", backgroundColor: "blue", color: "white", position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "20px" }}>
              {user.charAt(0)}
            </div>
          )}
          
          <div style={{width: "70%"}}>Chat Room</div>

          <Link href='/auth/login'>
            <LogOutBtn />
          </Link>
          
        </div>
        <UserItem username="John" /> 
      </div>

      <div className="chats" style={{ height: "100vh", width: "72%", borderLeft: "1px solid white" }}>
        {/* <h1 style={{margin: "30% 40%"}}>Welcome to Chat Room</h1> */}
      </div>

    </div>
  )
}