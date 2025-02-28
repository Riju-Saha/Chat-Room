"use client";
import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { io, Socket } from 'socket.io-client';

export default function Registerpage() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const newSocket: Socket = io('http://localhost:8080'); // Connect to your backend
    // const newSocket: Socket = io();

    newSocket.on('connect', () => {
      console.log(`Connected with socket ID: ${newSocket.id}`);
      setId(newSocket.id || null);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Log form submission
    console.log('Form submitted:', { id, username, name, gmail, password, phone });

    // Check if socket ID is available
    if (!id) {
      alert('Socket not connected');
      console.error('Socket ID not found. Connection might not be established.');
      return;
    }

    try {
      // Log the data being sent to the server
      console.log('Data being sent to server:', { id, username, name, gmail, password, phone });

      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, username, name, gmail, password, phone }),
      });

      console.log('Server response status:', response.status);

      if (!response.ok) {
        alert('Registration failed. Note: This username may exist.');
        return;
      }

      const data = await response.json();
      // Log the response data
      console.log('Response data:', data);

      if (data.success) {
        router.push(`/${username}?username=${username}`);
      } else {
        alert('Registration failed: ' + data.message);
        console.error('Registration failed:', data.message);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };


  return (
    <HelmetProvider>
      <Helmet>
        <script src="/socket.io/socket.io.js"></script>
      </Helmet>

      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black">
        <h2 className="font-bold text-xl text-center">
          Register
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-2">
            <Label htmlFor="Name">Name</Label>
            <Input id="Name" placeholder="Name" type="text" className="bg-black w-full" style={{ color: 'white', fontSize: '15px' }} value={name} onChange={(e) => setName(e.target.value)} required/>
          </LabelInputContainer>
          <LabelInputContainer className="mb-2">
            <Label htmlFor="Username">Username</Label>
            <Input id="Username"
              placeholder="Username" type="text" className="bg-black w-full" style={{ color: 'white', fontSize: '15px' }} value={username} onChange={(e) => setUsername(e.target.value)} required/>
          </LabelInputContainer>
          <LabelInputContainer className="mb-2">
            <Label htmlFor="Phone">Phone</Label>
            <Input id="Phone" placeholder="Phone" type="text" className="bg-black w-full" style={{ color: 'white', fontSize: '15px' }} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </LabelInputContainer>
          <LabelInputContainer className="mb-2">
            <Label htmlFor="Gmail">Gmail</Label>
            <Input id="Gmail" placeholder="Gmail" type="text" className="bg-black w-full" style={{ color: 'white', fontSize: '15px' }} value={gmail} onChange={(e) => setGmail(e.target.value)} required/>
          </LabelInputContainer>
          <LabelInputContainer className="mb-2">
            <Label htmlFor="Password">Password</Label>
            <Input id="Password" placeholder="Password" type="password" className="bg-black w-full" style={{ color: 'white', fontSize: '15px' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"> Create Account &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </HelmetProvider>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
