
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../../lib/auth";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const message = await prisma.guestbookMessage.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        profile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found." },
        { status: 404 }
      );
    }

    const isOwner = message.profile.userId === user.id;
    const isAuthor = message.authorId === user.id;

    if (!isOwner && !isAuthor) {
      return NextResponse.json(
        { error: "You cannot delete this message." },
        { status: 403 }
      );
    }

    await prisma.guestbookMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("GUESTBOOK_DELETE_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete message." },
      { status: 500 }
    );
  }
}
