import { NextResponse, type NextRequest } from 'next/server';
import axios, { isAxiosError } from 'axios';

// ----------------------------------------------------------------------
const BASE_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8001';
const EXTERNAL_API_ENDPOINT = `${BASE_URL}/api/web/v1/products`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Ambil params dari frontend
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);


    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    const params = {
      limit: limit,
      offset: offset,
      search: search, 
    };


    const response = await axios.get(EXTERNAL_API_ENDPOINT, {
      params: params,
    });


    return NextResponse.json(response.data);

  } catch (error) {

    if (isAxiosError(error)) {

      console.error(
        'AXIOS ERROR (Gagal panggil API eksternal):',
        error.response?.data
      );
      return NextResponse.json(
        {
          error: 'Failed to fetch from external API',
          details: error.response?.data,
        },
        { status: error.response?.status || 500 }
      );
    } else {
      console.error('UNKNOWN ERROR:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}