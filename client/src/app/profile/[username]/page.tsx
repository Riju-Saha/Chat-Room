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
      console.log(data);
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

  const containerStyle = {
    backgroundColor: 'black',
    color: 'black',
    fontWeight: "bold",
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    margin: '20px auto',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
  };

  // const titleStyle = {
  // };

  const labelStyle = {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '5px'
  };

  const valueStyle = {
    marginBottom: '15px',
    backgroundColor: 'lightgray',
    padding: '10px',
    borderRadius: '5px',
    fontWeight: "bold"
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', textAlign: 'center', marginBottom: '20px'}}>Profile Details</h1>
      <div>
        <p style={labelStyle}>Username:</p>
        <p style={valueStyle}>{username}</p>
      </div>
      <div>
        <p style={labelStyle}>ID:</p>
        <p style={valueStyle}>{userDetails.ID}</p>
      </div>
      <div>
        <p style={labelStyle}>Name:</p>
        <p style={valueStyle}>{userDetails.Name}</p>
      </div>
      <div>
        <p style={labelStyle}>Gmail:</p>
        <p style={valueStyle}>{userDetails.Gmail}</p>
      </div>
      <div>
        <p style={labelStyle}>Phone:</p>
        <p style={valueStyle}>{userDetails.Phone}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
