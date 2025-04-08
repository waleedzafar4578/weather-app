import { NextRequest, NextResponse } from 'next/server';
export async function GET() {
    return NextResponse.json({
        message: "Hello from the mobile api",
        timeStamp: new Date().toISOString()
    })
}