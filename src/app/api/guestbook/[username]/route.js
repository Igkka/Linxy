    
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../lib/auth";

const MAX_MESSAGE_LENGTH = 500;
const MAX_NAME_LENGTH = 30;

export async function GET(request, { params }) {
  try {
    const { username } = await params;

    const profile = await prisma.profile.findFirst({
      where: {
        user: { username },
      },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    const messages = await prisma.guestbookMessage.findMany({
      where: {
        profileId: profile.id,
        isHidden: false,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        authorName: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GUESTBOOK_GET_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load guestbook." },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { username } = await params;
    const body = await request.json();

    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    const suppliedName =
      typeof body.authorName === "string"
        ? body.authorName.trim()
        : "";

    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message must contain 1–500 characters." },
        { status: 400 }
      );
    }

    if (suppliedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: "Name must not exceed 30 characters." },
        { status: 400 }
      );
    }

    const owner = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        profile: { select: { id: true } },
      },
    });

    if (!owner?.profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    const currentUser = await getCurrentUser();

    // Use the account's actual username for authenticated visitors.
    const authenticatedUser = currentUser?.id
      ? await prisma.user.findUnique({
          where: { id: currentUser.id },
          select: { id: true, username: true },
        })
      : null;

    const authorName = authenticatedUser
      ? authenticatedUser.username
      : suppliedName || "Guest";

    const message = await prisma.guestbookMessage.create({
      data: {
        profileId: owner.profile.id,
        authorId: authenticatedUser?.id ?? null,
        authorName,
        content,
      },
      select: {
        id: true,
        authorName: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("GUESTBOOK_POST_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
