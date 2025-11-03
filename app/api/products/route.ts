import { NextResponse, type NextRequest } from 'next/server';
import axios, { isAxiosError } from 'axios';

// ----------------------------------------------------------------------
// Ganti 'http://localhost:8000' dengan URL backend Anda
// ----------------------------------------------------------------------
const BASE_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8001';
const EXTERNAL_API_ENDPOINT = `${BASE_URL}/api/web/v1/products`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Ambil params dari frontend
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // 2. PERBAIKAN DI SINI:
    // Ambil 'search'. Jika null (tidak dikirim), jadikan string kosong "".
    const search = searchParams.get('search') || '';

    // 3. Hitung offset
    const offset = (page - 1) * limit;

    // 4. Siapkan params untuk dikirim ke API EKSTERNAL
    // Kita akan gunakan object biasa agar lebih mudah dibaca
    const params = {
      limit: limit,
      offset: offset,
      search: search, // Kita sekarang SELALU mengirim 'search'
    };

    // 5. Panggil API eksternal dengan Axios
    const response = await axios.get(EXTERNAL_API_ENDPOINT, {
      params: params,
    });

    // 6. Kembalikan data dari API eksternal ke frontend
    return NextResponse.json(response.data);

  } catch (error) {
    // 7. Penanganan error
    if (isAxiosError(error)) {
      // Tampilkan error dari backend di console Next.js Anda untuk debugging
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