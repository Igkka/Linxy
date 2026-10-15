import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request) {
try {
const { username } = await request.json();

    if (typeof username !== "string" || !username.trim()) {
        return NextResponse.json(
            { error: "Username is required." },
            { status: 400 }
        );
    }

    const user = await prisma.user.findUnique({
        where: { username: username.trim() },
        select: {
            profile: {
                select: {
                    id: true,
                    views: true
                }
            }
        }
    });

    if (!user?.profile) {
        return NextResponse.json(
            { error: "Profile not found." },
            { status: 404 }
        );
    }

    const profile = user.profile;
    const visitorId =
        request.cookies.get("linxy_visitor")?.value || randomUUID();

    const cooldownStart = new Date(
        Date.now() - 24 * 60 * 60 * 1000
    );

    const recentView = await prisma.profileView.findFirst({
        where: {
            profileId: profile.id,
            visitorId,
            viewedAt: {
                gte: cooldownStart
            }
        },
        select: { id: true }
    });

    let views = profile.views;

    if (!recentView) {
        const result = await prisma.$transaction(async (tx) => {
            await tx.profileView.create({
                data: {
                    profileId: profile.id,
                    visitorId
                }
            });

            return tx.profile.update({
                where: { id: profile.id },
                data: {
                    views: { increment: 1 }
                },
                select: { views: true }
            });
        });

        views = result.views;
    }

    const response = NextResponse.json({
        success: true,
        views
    });

    response.cookies.set("linxy_visitor", visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365
    });

    return response;
} catch (error) {
    console.error("PROFILE_VIEW_ERROR:", error);

    return NextResponse.json(
        { error: "Failed to count view." },
        { status: 500 }
    );
}

}