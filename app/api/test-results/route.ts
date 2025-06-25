import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add this configuration
export const dynamic = 'force-dynamic'; // Prevent static generation
export const revalidate = 0; // Prevent caching

export async function POST(request: NextRequest) {
  console.log('POST request received');
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { wpm, accuracy, difficulty } = body;
    console.log('Parsed values:', { wpm, accuracy, difficulty });

    const result = await prisma.testResult.create({
      data: {
        wpm: Number(wpm),
        accuracy: Number(accuracy),
        difficulty: String(difficulty || 'easy'),
      },
    });

    console.log('Created test result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      meta: error.meta,
    });
    return NextResponse.json(
      { 
        error: 'Failed to save test result',
        message: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('GET request received');
  try {
    const results = await prisma.testResult.findMany({
      select: {
        id: true,
        wpm: true,
        accuracy: true,
        difficulty: true,
        timestamp: true
      },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    console.log('Fetched results:', results);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch test results',
        message: error.message,
      },
      { status: 500 }
    );
  }
}