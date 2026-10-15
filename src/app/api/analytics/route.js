
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user?.id) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: {
                id: true,
                views: true
            }
        });

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found." },
                { status: 404 }
            );
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const startDate = new Date(today);
        startDate.setUTCDate(startDate.getUTCDate() - 6);

        const events = await prisma.profileView.findMany({
            where: {
                profileId: profile.id,
                viewedAt: {
                    gte: startDate
                }
            },
            select: {
                viewedAt: true
            }
        });

        const dailyViews = Array.from(
            { length: 7 },
            (_, index) => {
                const date = new Date(startDate);
                date.setUTCDate(date.getUTCDate() + index);

                return {
                    date: date.toISOString().slice(0, 10),
                    views: 0
                };
            }
        );

        const viewsByDate = new Map(
            dailyViews.map((day) => [day.date, day])
        );

        for (const event of events) {
            const date = event.viewedAt.toISOString().slice(0, 10);
            const day = viewsByDate.get(date);

            if (day) {
                day.views += 1;
            }
        }

        return NextResponse.json({
            views: profile.views,
            dailyViews
        });
    } catch (error) {
        console.error("VIEWS_ANALYTICS_ERROR:", error);

        return NextResponse.json(
            { error: "Failed to load analytics." },
            { status: 500 }
        );
    }
}
