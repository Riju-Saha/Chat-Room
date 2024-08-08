"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [userDetails, setUserDetails] = useState({
    ID: '',
    Name: '',
    Gmail: '',
    Phone: '',
  });

  useEffect(() => {
    if (username) {
      fetchProfileData(username); 
    }
  }, [username]);

  const fetchProfileData = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:8080/profile/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        alert("Profile not found");
        return;
      }

      const data = await response.json();
      console.log(data)
      if (data.success) {
        setUserDetails({
          ID: data.result[0].ID,
          Name: data.result[0].Name,
          Gmail: data.result[0].Gmail,
          Phone: data.result[0].Phone,
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      alert('Failed to load profile. Please try again.');
    }
  };

  return (
    <div>
      <p>Username: {username}</p>
      <p>ID: {userDetails.ID}</p>
      <p>Name: {userDetails.Name}</p>
      <p>Gmail: {userDetails.Gmail}</p>
      <p>Phone: {userDetails.Phone}</p>
    </div>
  );
};

export default ProfilePage;
