
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../lib/prisma.js";
import { getCurrentUser } from "../../../../../lib/auth.js";

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
        const { currentPassword, newPassword } = body;

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string"
        ) {
            return NextResponse.json(
                { error: "Fill in both password fields." },
                { status: 400 }
            );
        }

        if (newPassword.length < 8 || newPassword.length > 72) {
            return NextResponse.json(
                { error: "The new password must contain between 8 and 72 characters." },
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
            currentPassword,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "The current password is incorrect." },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });

        return NextResponse.json({
            message: "The password has been successfully changed.",
        });
    } catch (error) {
        console.error("PASSWORD_CHANGE_ERROR:", error);

        return NextResponse.json(
            { error: "The password could not be changed." },
            { status: 500 }
        );
    }
}
