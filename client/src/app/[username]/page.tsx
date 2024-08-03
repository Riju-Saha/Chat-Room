"use client"
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import UserItem from '@/components/useritem';

export default function Usernamepage() {

  interface UserItem {
    username: string | null;
  }

  const searchParams = useSearchParams();
  const user = searchParams.get('username');
  return (
    <div style={{ display: "flex" }}>
      <div className='friends' style={{ height: "100vh", width: "27%", borderRight: "1px solid white" }}>
        <h1 >friends section</h1>
        <UserItem username={user} />
        <UserItem username="Doe" />
        <UserItem username="John" />
        <UserItem username="Doe" />
        <UserItem username="John" />
      </div>
      <div className="chats" style={{ height: "100vh", width: "73%", borderLeft: "1px solid white" }}>
        <h1 >chat section</h1>
      </div>
    </div>
  )
}