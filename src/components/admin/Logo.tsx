import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', padding: '20px 0' }}>
      <span style={{ fontSize: '24px', fontWeight: 800, color: '#2D2D2D', letterSpacing: '-0.02em' }}>
        KWIK
      </span>
      <span style={{ fontSize: '24px', fontWeight: 800, color: '#E8611A', letterSpacing: '-0.02em' }}>
        BUILT
      </span>
      <span style={{ marginLeft: '6px', fontSize: '13px', fontWeight: 500, color: '#A89068' }}>
        HOMES
      </span>
    </div>
  )
}
