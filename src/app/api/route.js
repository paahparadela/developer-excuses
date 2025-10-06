
import Client from 'magic-hour';
import { promises as fs } from 'fs';
import path from 'path';

console.log('Token available:', !!process.env.TOKEN);

const client = new Client({
  token: process.env.TOKEN,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return Response.json({ error: 'Prompt is required.' }, { status: 400 });
    }
    console.log('Generating image with prompt:', prompt);
    
    const createRes = await client.v1.aiImageGenerator.generate(
      {
        imageCount: 1,
        orientation: 'landscape',
        style: { prompt },
      },
      {
        waitForCompletion: true,
      }
    );

    console.log('API Response:', JSON.stringify(createRes, null, 2));

    // Get the direct URLs from the downloads array
    if (!createRes.downloads || createRes.downloads.length === 0) {
      console.error('No downloads in response');
      return Response.json({ error: 'No image downloads received from API' }, { status: 500 });
    }

    const imageUrls = createRes.downloads.map(download => download.url);
    
    console.log('Image URLs:', imageUrls);

    return Response.json({
      id: createRes.id,
      creditsCharged: createRes.creditsCharged,
      imageUrls,
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