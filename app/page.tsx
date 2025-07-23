'use client';

import { useEffect, useState } from 'react';

const timeZones = {
  "Mountain Time": ["711672778927112323"],
  "Central Time": ["654843922648137749"],
  "British Time": [
    "660866934677569546",
    "868475673604419624",
    "1355199520073584841"
  ],
} as const;

type TimeZoneKey = keyof typeof timeZones;

const timeZoneNames: Record<TimeZoneKey, string> = {
  "Mountain Time": 'America/Denver',
  "Central Time": 'America/Chicago',
  "British Time": 'Europe/London',
};

type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
};

function getAvatarUrl(user: DiscordUser) {
  if (!user.avatar) {
    // Default avatar
    const defaultAvatar = Number(user.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}

function getDisplayName(user: DiscordUser) {
  // Remove #0 or #0000 from the end
  if (user.discriminator === '0' || user.discriminator === '0000') {
    return user.username;
  }
  return `${user.username}#${user.discriminator}`;
}

function getCurrentTime(tz: string) {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
  });
}

export default function Home() {
  const [users, setUsers] = useState<Record<string, DiscordUser | null>>({});
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    Object.values(timeZones).flat().forEach(id => {
      fetch(`/api/discord-user/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setUsers(prev => ({ ...prev, [id]: data }));
        });
    });
    // Update time every 30 seconds
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#181a20',
      color: '#f1f1f1',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h1 style={{ fontWeight: 700, fontSize: 36, margin: '40px 0 24px 0', color: '#fff' }}>Discord Users by Time Zone</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 48,
        width: '100%',
        maxWidth: 1200,
      }}>
        {Object.entries(timeZones).map(([zone, ids]) => {
          const zoneKey = zone as TimeZoneKey;
          const tzName = timeZoneNames[zoneKey] || 'UTC';
          return (
            <section key={zone} style={{
              background: '#23272f',
              borderRadius: 16,
              padding: 32,
              minWidth: 260,
              boxShadow: '0 2px 16px #0002',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <h2 style={{ color: '#7ab7ff', fontWeight: 600, fontSize: 24, marginBottom: 16 }}>{zone}</h2>
              <div style={{ color: '#b3b3b3', marginBottom: 24, fontSize: 18 }}>
                {getCurrentTime(tzName)} <span style={{ fontSize: 14, color: '#888' }}>({tzName.split('/')[1] || tzName})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                {ids.map(id => {
                  const user = users[id];
                  return (
                    <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#181a20', borderRadius: 12, padding: 16, width: 180, boxShadow: '0 1px 6px #0003' }}>
                      <img
                        src={user ? getAvatarUrl(user) : 'https://cdn.discordapp.com/embed/avatars/0.png'}
                        alt={user ? user.username : 'Loading...'}
                        width={64}
                        height={64}
                        style={{ borderRadius: '50%', marginBottom: 12, border: '2px solid #23272f' }}
                      />
                      <span style={{ fontWeight: 500, fontSize: 18, color: '#fff', marginBottom: 4 }}>
                        {user ? `${getDisplayName(user)} (${user.username})` : 'Loading...'}
                      </span>
                      <small style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>({id})</small>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <style>{`
        ::selection { background: #7ab7ff33; }
        body { background: #181a20; }
      `}</style>
    </main>
  );
} 