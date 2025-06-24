import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: [
        { wpm: 'desc' },
        { accuracy: 'desc' }
      ],
      take: 10,
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, wpm, accuracy } = body;

    const entry = await prisma.leaderboard.create({
      data: {
        username,
        wpm,
        accuracy,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error saving leaderboard entry:', error);
    return NextResponse.json(
      { error: 'Failed to save leaderboard entry' },
      { status: 500 }
    );
  }
}