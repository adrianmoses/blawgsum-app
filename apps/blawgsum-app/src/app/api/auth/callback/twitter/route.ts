import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    console.log("authenticating request from twitter")

    const code = request.nextUrl.searchParams.get("code")
    const state = request.nextUrl.searchParams.get("state")

    // get the other stuff from the session
    console.log("redirecting to /projects/social/twitter?code=" + code + "&state=" + state)
    return NextResponse.redirect(`${process.env.BLAWGSUM_APP_HOST!}/admin/social/twitter?code=${code}&state=${state}`)
}