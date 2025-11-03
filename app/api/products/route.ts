// Lokasi file: app/api/product/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import axios, { isAxiosError } from 'axios';

// ----------------------------------------------------------------------
// ⚠️ PENTING: Pastikan URL ini SAMA dengan di file 'products/route.ts'
// ----------------------------------------------------------------------
const BASE_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8000';

// Ini adalah endpoint eksternal yang akan kita panggil
const EXTERNAL_API_ENDPOINT = `${BASE_URL}/api/web/v1/product`;

/**
 * Handle GET /api/product
 * Mendapatkan satu produk berdasarkan product_id
 * [cite: 52]
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'product_id query is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(EXTERNAL_API_ENDPOINT, {
      params: { product_id: productId },
    });
    return NextResponse.json(response.data);

  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: 'Failed to fetch product', details: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

/**
 * Handle POST /api/product
 * Membuat produk baru
 * [cite: 53]
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Panggil API eksternal untuk membuat produk
    const response = await axios.post(EXTERNAL_API_ENDPOINT, body);
    
    // Kembalikan data (response.data) dari API eksternal
    return NextResponse.json(response.data, { status: 201 }); // 201 Created

  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: 'Failed to create product', details: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

/**
 * Handle PUT /api/product
 * Memperbarui produk yang ada berdasarkan product_id
 * [cite: 54]
 */
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'product_id query is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    // Panggil API eksternal untuk memperbarui produk
    const response = await axios.put(EXTERNAL_API_ENDPOINT, body, {
      params: { product_id: productId },
    });
    
    // Kembalikan data (response.data) dari API eksternal
    return NextResponse.json(response.data);

  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: 'Failed to update product', details: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}