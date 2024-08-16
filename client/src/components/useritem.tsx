import React from 'react';

export default function UserItem(props: {
  username: string | null;
  onClick: (username: string | null) => void;
}) {
  return (
    <div
      style={{ backgroundColor: "violet", marginTop: "5%", padding: "2%", cursor: 'pointer', height: '6vh' }}
      onClick={() => props.onClick(props.username)}
    >
      {props.username}
    </div>
  );
}
