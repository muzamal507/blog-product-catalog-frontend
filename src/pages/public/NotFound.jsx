import React from 'react'
import { Link } from 'react-router-dom'
function NotFound() {
  return (
    <div style={{padding:80, textAlign:'center'}}>
      <h1 style={{fontSize:72, color:'#00b894'}}>404</h1>
      <p style={{marginBottom:24}}>Page not found</p>
      <Link to="/" style={{color:'#00b894'}}>← Back to Home</Link>
    </div>
  )
}
export default NotFound