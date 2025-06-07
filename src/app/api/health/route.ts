import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      build: process.env.NODE_ENV,
      version: process.env.npm_package_version ?? '1.0.0',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
