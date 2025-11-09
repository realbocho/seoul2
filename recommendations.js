// Vercel Serverless Function for recommendations API
let recommendations = {};

// CORS 헤더 설정
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// OPTIONS 요청 처리 (CORS preflight)
export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    // CORS preflight 요청 처리
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        if (req.method === 'GET') {
            return new Response(JSON.stringify(recommendations), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        if (req.method === 'POST') {
            const data = await req.json();
            const { placeName, address, x, y, reason } = data;

            if (!placeName || !reason) {
                return new Response(JSON.stringify({ error: '장소명과 추천 사유는 필수입니다.' }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }

            const key = placeName + '|' + address;
            if (!recommendations[key]) {
                recommendations[key] = {
                    placeName,
                    address,
                    x,
                    y,
                    reasons: []
                };
            }
            recommendations[key].reasons.push(reason);

            return new Response(JSON.stringify(recommendations[key]), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        return new Response(JSON.stringify({ error: '지원하지 않는 메서드입니다.' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });

    } catch (error) {
        console.error('API 오류:', error);
        return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
}