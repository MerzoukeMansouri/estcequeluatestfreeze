import { NextResponse } from 'next/server';
import { isCurrentlyFreeze } from '../../../lib/freeze-utils';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Retourne si on est actuellement en freeze
export async function GET() {
  try {
    // Utilise la fonction utilitaire partagée pour vérifier le freeze
    const isFreeze = await isCurrentlyFreeze();

    return NextResponse.json({ isFreeze });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to check freeze status';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
