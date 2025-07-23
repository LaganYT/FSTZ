import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Missing Discord bot token' }, { status: 500 });
  }

  const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
    headers: {
      Authorization: `Bot ${token}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'User not found' }, { status: res.status });
  }

  const user = await res.json();
  return NextResponse.json(user);
} 