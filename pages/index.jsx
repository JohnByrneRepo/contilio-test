import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { MeshViewer } from './meshViewer'

export default function Page() {
  const [ session, loading ] = useSession()

  return <>
    {!session && <>
      <div className="info">Not signed in <br/>
      <button className="button" onClick={signIn}>Sign in</button></div>
    </>}
    {session && <>
      <div className="info">Signed in as {session.user.email} <br/>
      <button className="button" onClick={signOut}>Sign out</button></div>
      <MeshViewer/>
    </>}
  </>
}
