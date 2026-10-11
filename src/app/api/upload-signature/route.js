
import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";

export async function POST() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const timestamp = Math.round(Date.now() / 1000);
        const folder = "linxy/music";

        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_API_SECRET
        );

        return NextResponse.json({
            timestamp,
            folder,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME
        });
    } catch (error) {
        console.error("UPLOAD_SIGNATURE_ERROR:", error);

        return NextResponse.json(
            { error: "Failed to create upload signature" },
            { status: 500 }
        );
    }
}
