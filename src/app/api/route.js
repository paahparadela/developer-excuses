
import Client from 'magic-hour';
import { promises as fs } from 'fs';
import path from 'path';

const client = new Client({
  token: process.env.TOKEN,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return Response.json({ error: 'Prompt is required.' }, { status: 400 });
    }
    const publicOutputDir = path.join(process.cwd(), 'public', 'outputs');
    
    // Ensure public/outputs directory exists
    try {
      await fs.mkdir(publicOutputDir, { recursive: true });
    } catch (err) {
      console.warn('Warning: Could not create outputs directory:', err.message);
      // Continue execution as the directory might already exist
    }

    const createRes = await client.v1.aiImageGenerator.generate(
      {
        imageCount: 1,
        orientation: 'landscape',
        style: { prompt },
      },
      {
        waitForCompletion: true,
        downloadOutputs: true,
        downloadDirectory: path.join('public', 'outputs'),
      }
    );

    const generatedPaths = (createRes.downloadedPaths || []).map(filePath => {
      const fileName = path.basename(filePath);
      return `outputs/${fileName}`;
    });

    return Response.json({
      id: createRes.id,
      creditsCharged: createRes.creditsCharged,
      downloadedPaths: generatedPaths,
      message: 'Image generated successfully.'
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Image generation failed.' }, { status: 500 });
  }
}

// Health Check
export async function GET() {
  return Response.json({ message: 'Magic Hour API is running.' });
}