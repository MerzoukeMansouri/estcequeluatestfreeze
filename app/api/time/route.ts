import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  return NextResponse.json({
    timestamp: now.toISOString(),
    localString: now.toString(),
    dayOfWeek: now.getDay(),
    dayOfWeekISO: now.getDay() === 0 ? 7 : now.getDay(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}
