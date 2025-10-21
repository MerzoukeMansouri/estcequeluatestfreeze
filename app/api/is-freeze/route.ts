import { NextResponse } from 'next/server';
import { isCurrentlyFreeze } from '../../../lib/freeze-utils';

// GET: Retourne si on est actuellement en freeze
export async function GET() {
  try {
    // Utilise la fonction utilitaire partagée pour vérifier le freeze
    const isFreeze = await isCurrentlyFreeze();

    return NextResponse.json({ isFreeze });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check freeze status' },
      { status: 500 }
    );
  }
}
