import { NextResponse, type NextRequest } from 'next/server';
import axios, { isAxiosError } from 'axios';


const BASE_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8001';
const EXTERNAL_API_ENDPOINT = `${BASE_URL}/api/web/v1/product`;

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
    const status = isAxiosError(error) ? error.response?.status : 500;
    const details = isAxiosError(error) ? error.response?.data : 'An unknown error occurred';
    console.error('[API_PRODUCT_GET_ERROR]', details);

    return NextResponse.json(
      { error: 'Failed to fetch product', details },
      { status: status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(EXTERNAL_API_ENDPOINT, body);
    return NextResponse.json(response.data, { status: 201 });

  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : 500;
    const details = isAxiosError(error) ? error.response?.data : 'An unknown error occurred';
    console.error('[API_PRODUCT_POST_ERROR]', details);

    return NextResponse.json(
      { error: 'Failed to create product', details },
      { status: status || 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'product_id query is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const response = await axios.put(EXTERNAL_API_ENDPOINT, body, {
      params: { product_id: productId },
    });
    return NextResponse.json(response.data);

  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : 500;
    const details = isAxiosError(error) ? error.response?.data : 'An unknown error occurred';
    console.error('[API_PRODUCT_PUT_ERROR]', details);

    return NextResponse.json(
      { error: 'Failed to update product', details },
      { status: status || 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'product_id query is required' }, { status: 400 });
  }

  try {
    // API eksternal untuk menghapus produk
    const response = await axios.delete(EXTERNAL_API_ENDPOINT, {
      params: { product_id: productId },
    });
    return NextResponse.json(response.data);
  
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : 500;
    const details = isAxiosError(error) ? error.response?.data : 'An unknown error occurred';
    console.error('[API_PRODUCT_DELETE_ERROR]', details);

    return NextResponse.json(
      { error: 'Failed to delete product', details },
      { status: status || 500 }
    );
  }
}