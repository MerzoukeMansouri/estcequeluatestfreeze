import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/config-store';

// GET: Retourne si on est actuellement en freeze
export async function GET() {
  try {
    // Lire la configuration en mémoire
    const config = getConfig();

    // Obtenir le jour de la semaine actuel (1=Lun, 7=Dim)
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();

    // Vérifier si aujourd'hui est un jour de freeze
    const isFreeze = config.freezeDays.includes(dayOfWeek);

    return NextResponse.json({ isFreeze });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check freeze status' },
      { status: 500 }
    );
  }
}
