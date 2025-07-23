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

export default function Home() {
  const [users, setUsers] = useState<Record<string, DiscordUser | null>>({});

  useEffect(() => {
    Object.values(timeZones).flat().forEach(id => {
      fetch(`/api/discord-user/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setUsers(prev => ({ ...prev, [id]: data }));
        });
    });
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: 32 }}>
      <h1>Discord Users by Time Zone</h1>
      {Object.entries(timeZones).map(([zone, ids]) => (
        <section key={zone} style={{ marginBottom: 32 }}>
          <h2>{zone}</h2>
          {ids.map(id => {
            const user = users[id];
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <img
                  src={user ? getAvatarUrl(user) : 'https://cdn.discordapp.com/embed/avatars/0.png'}
                  alt={user ? user.username : 'Loading...'}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%', marginRight: 16 }}
                />
                <span>
                  {user ? `${user.username}#${user.discriminator}` : 'Loading...'}
                  <small style={{ marginLeft: 8, color: '#888' }}>({id})</small>
                </span>
              </div>
            );
          })}
        </section>
      ))}
    </main>
  );
} 