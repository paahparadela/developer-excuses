
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
    const createRes = await client.v1.aiImageGenerator.generate(
      {
        imageCount: 1,
        orientation: 'landscape',
        style: { prompt },
      },
      {
        waitForCompletion: true,
        downloadOutputs: true,
        downloadDirectory: 'outputs',
      }
    );

    // Move generated images to public/outputs where they can be served
    const movedPaths = [];
    for (const filePath of createRes.downloadedPaths || []) {
      const fileName = path.basename(filePath);
      const destDir = path.join(process.cwd(), 'public', 'outputs');
      const destPath = path.join(destDir, fileName);
      await fs.mkdir(destDir, { recursive: true });
      await fs.copyFile(filePath, destPath);
      movedPaths.push(`outputs/${fileName}`);
    }

    return Response.json({
      id: createRes.id,
      creditsCharged: createRes.creditsCharged,
      downloadedPaths: movedPaths,
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