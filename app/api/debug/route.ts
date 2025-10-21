import { NextResponse } from 'next/server';
import { getConfig } from '../../../lib/config-store';
import { getCurrentDayOfWeek, isCurrentlyFreeze } from '../../../lib/freeze-utils';

export async function GET() {
  const config = getConfig();
  const dayOfWeek = getCurrentDayOfWeek();
  const isFreeze = isCurrentlyFreeze();

  return NextResponse.json({
    currentDayOfWeek: dayOfWeek,
    configFreezeDays: config.freezeDays,
    isFreeze: isFreeze,
    envVar: process.env.FREEZE_DAYS || null,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    date: new Date().toString()
  });
}
