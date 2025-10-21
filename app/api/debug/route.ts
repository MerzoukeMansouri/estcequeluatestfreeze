import { NextResponse } from 'next/server';
import { getConfig } from '../../../lib/config-store';
import { getCurrentDayOfWeek } from '../../../lib/freeze-utils';

export async function GET() {
  try {
    const config = await getConfig();
    const dayOfWeek = getCurrentDayOfWeek();
    const isFreeze = config.freezeDays.includes(dayOfWeek);

    return NextResponse.json({
      config,
      dayOfWeek,
      isFreeze,
      freezeDaysIncludesDayOfWeek: config.freezeDays.includes(dayOfWeek),
      debug: {
        freezeDaysArray: config.freezeDays,
        freezeDaysType: typeof config.freezeDays,
        isArray: Array.isArray(config.freezeDays),
        dayOfWeekValue: dayOfWeek,
        dayOfWeekType: typeof dayOfWeek,
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Debug failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
