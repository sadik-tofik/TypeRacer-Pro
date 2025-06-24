import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wpm, accuracy } = body;

    const result = await prisma.testResult.create({
      data: {
        wpm,
        accuracy,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving test result:', error);
    return NextResponse.json(
      { error: 'Failed to save test result' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const results = await prisma.testResult.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test results' },
      { status: 500 }
    );
  }
}