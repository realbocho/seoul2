// Next.js API route for recommendations
import { NextResponse } from 'next/server';

// 메모리에 데이터 저장 (테스트용)
let recommendations = {};

export async function GET() {
    return NextResponse.json(recommendations, {
        headers: {
            'Access-Control-Allow-Origin': 'https://realbocho.github.io',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(request) {
    try {
        const data = await request.json();
        const { placeName, address, x, y, reason } = data;

        if (!placeName || !reason) {
            return NextResponse.json(
                { error: '장소명과 추천 사유는 필수입니다.' },
                { 
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': 'https://realbocho.github.io',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                }
            );
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

        return NextResponse.json(recommendations[key], {
            status: 201,
            headers: {
                'Access-Control-Allow-Origin': 'https://realbocho.github.io',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        console.error('API 오류:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': 'https://realbocho.github.io',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            }
        );
    }
}

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': 'https://realbocho.github.io',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}