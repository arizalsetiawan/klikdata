import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { keyword } = params;

  try {
    const response = await fetch(
      `https://ap-mc.klikindomaret.com/assets-klikidmsearch/api/get/catalog-xpress/api/webapp/search/autocomplete?storeCode=TJKT&latitude=-6.1763897&longitude=106.82667&mode=DELIVERY&districtId=141100100&keyword=${encodeURIComponent(keyword)}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
          'Accept': 'application/json, text/plain, */*',
          'sec-fetch-site': 'same-site',
          'sec-fetch-mode': 'cors',
          'origin': 'https://www.klikindomaret.com',
          'referer': 'https://www.klikindomaret.com/',
          'page': '/search',
          'sec-fetch-dest': 'empty',
          'accept-language': 'id-ID,id;q=0.9',
          'priority': 'u=3, i'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json({
        status: 'error',
        message: `Failed to fetch search results. HTTP Status: ${response.status}`
      }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: `Exception: ${error.message}`
    }, { status: 500 });
  }
}
