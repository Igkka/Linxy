
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../lib/auth";

export async function DELETE(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return NextResponse.json(
                { error: "Authorization is required." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { password } = body;

        if (typeof password !== "string" || !password) {
            return NextResponse.json(
                { error: "Enter the current password." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: {
                id: true,
                passwordHash: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "The user was not found." },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: { id: user.id },
        });

        const response = NextResponse.json({
            message: "The account has been successfully deleted.",
        });

        response.cookies.set("linc_session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        console.error("DELETE_ACCOUNT_ERROR:", error);

        return NextResponse.json(
            { error: "The account could not be deleted." },
            { status: 500 }
        );
    }
}
