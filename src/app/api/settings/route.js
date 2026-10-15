
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { getCurrentUser } from "../../../../lib/auth.js";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return NextResponse.json(
                { error: "Authorization is required." },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: {
                id: true,
                uid: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("SETTINGS_GET_ERROR:", error);

        return NextResponse.json(
            { error: "Failed to load the settings" },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return NextResponse.json(
                { error: "Authorization is required." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const username =
            typeof body.username === "string"
                ? body.username.trim()
                : "";

        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            return NextResponse.json(
                {
                    error:
                        "The username must contain 3–20 characters: Latin letters, numbers, or _",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "The user was not found." },
                { status: 404 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (existingUser && existingUser.id !== currentUser.id) {
            return NextResponse.json(
                { error: "This username is already taken." },
                { status: 409 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: currentUser.id },
            data: { username },
            select: {
                id: true,
                uid: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            message: "The username has been successfully changed.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("SETTINGS_PATCH_ERROR:", error);

        return NextResponse.json(
            { error: "Failed to update the settings" },
            { status: 500 }
        );
    }
}
