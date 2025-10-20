import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

interface Config {
  freezeDays: number[];
}

// GET: Retourne la configuration actuelle
export async function GET() {
  try {
    const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config: Config = JSON.parse(fileContents);
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

    // Écrire la nouvelle configuration
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2), 'utf8');

    return NextResponse.json({ success: true, config: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
