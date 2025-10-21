import { NextResponse } from 'next/server';
import { getConfig, setConfig, type Config } from '@/lib/config-store';

// GET: Retourne la configuration actuelle
export async function GET() {
  try {
    const config = getConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read config' },
      { status: 500 }
    );
  }
}

// POST: Met à jour la configuration
export async function POST(request: Request) {
  try {
    const body: Config = await request.json();

    // Validation: freezeDays doit être un tableau de nombres entre 1 et 7
    if (!Array.isArray(body.freezeDays)) {
      return NextResponse.json(
        { error: 'freezeDays must be an array' },
        { status: 400 }
      );
    }

    const isValid = body.freezeDays.every(
      (day) => typeof day === 'number' && day >= 1 && day <= 7
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'freezeDays must contain numbers between 1 and 7' },
        { status: 400 }
      );
    }

    // Mettre à jour la configuration en mémoire
    setConfig(body);

    return NextResponse.json({ success: true, config: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
