import React from 'react'

export default function UserItem(props: {
  username: string | null;
}) {
  return (
    <div style={{ backgroundColor: "violet", marginTop: "5%", padding: "2%" }}>
      {props.username}
    </div>
  )
}
