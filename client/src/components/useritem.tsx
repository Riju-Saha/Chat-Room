import React from 'react'

export default function UserItem(props: {
  username: string | null;
}) {
  return (
    <div style={{width: "95%", backgroundColor: "red", margin: "2% auto"}}>
      {props.username}
    </div>
  )
}
