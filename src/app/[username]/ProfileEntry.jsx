"use client";

import { useState } from "react";

export default function ProfileEntry({ username, children }) {
const [entered, setEntered] = useState(false);
const [loading, setLoading] = useState(false);

async function enterProfile() {
    if (entered || loading) return;

    setLoading(true);

    // Запускаем музыку по клику пользователя.
    window.dispatchEvent(new Event("linxy:enter-profile"));
    setEntered(true);

    try {
        const key = `linxy-view-${username}`;
        const lastView = Number(localStorage.getItem(key) || 0);
        const cooldown = 24 * 60 * 60 * 1000;

        // Не засчитываем повторный просмотр в течение 24 часов.
        if (Date.now() - lastView >= cooldown) {
            const response = await fetch("/api/view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem(key, String(Date.now()));

                window.dispatchEvent(
                    new CustomEvent("linxy:views-updated", {
                        detail: { views: data.views },
                    })
                );
            }
        }
    } catch (error) {
        console.error("PROFILE_ENTRY_ERROR:", error);
    } finally {
        setLoading(false);
    }
}

return (
    <div className="profile-entry-wrapper">
        {children}

        {!entered && (
            <button
                type="button"
                className="profile-entry-overlay"
                onClick={enterProfile}
                aria-label={`Enter ${username}'s profile`}
                disabled={loading}
            >
                <span className="profile-entry-label">
                    Click To Show Profile
                </span>

                <span className="profile-entry-username">
                    {username}
                </span>
            </button>
        )}
    </div>
);

}