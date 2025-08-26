import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { plu } = params;

  try {
    // Cek apakah gambar sudah ada di public/thumb
    const publicDir = path.join(process.cwd(), 'public', 'thumb');
    const imagePath = path.join(publicDir, `${plu}.jpg`);
    
    // Buat direktori thumb jika belum ada
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Jika gambar sudah ada, langsung return URL
    if (fs.existsSync(imagePath)) {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      const imageUrl = `${baseUrl}/thumb/${plu}.jpg`;
      
      return NextResponse.json({
        status: 'success',
        image_url: imageUrl,
        local_path: imagePath
      });
    }
    
    // Jika belum ada, download dari sumber eksternal
    const externalUrl = `https://assets.klikindomaret.com/products/${plu}/${plu}_1.jpg`;
    const response = await fetch(externalUrl);
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Simpan gambar ke public/thumb
      fs.writeFileSync(imagePath, buffer);
      
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      const imageUrl = `${baseUrl}/thumb/${plu}.jpg`;
      
      return NextResponse.json({
        status: 'success',
        image_url: imageUrl,
        local_path: imagePath
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: `Failed to download image. HTTP Status: ${response.status}`
      }, { status: 404 });
    }
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: `Exception: ${error.message}`
    }, { status: 500 });
  }
}
