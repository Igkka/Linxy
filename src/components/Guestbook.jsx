
"use client";

import { useCallback, useEffect, useState } from "react";
import "./Guestbook.css";
import { Trash2 } from "lucide-react";

export default function Guestbook({ username, isOwner = false }) {
    const [messages, setMessages] = useState([]);
    const [authorName, setAuthorName] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const loadMessages = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/guestbook/${encodeURIComponent(username)}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to load messages.");
            }

            setMessages(data.messages || []);
        } catch (err) {
            setError(err.message || "Failed to load messages.");
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setNotice("");

        if (!content.trim() || content.trim().length > 500) {
            setError("Message must contain 1–500 characters.");
            return;
        }

        setSending(true);

        try {
            const response = await fetch(
                `/api/guestbook/${encodeURIComponent(username)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        authorName: authorName.trim(),
                        content: content.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message.");
            }

            setContent("");
            setAuthorName("");
            setNotice("Message sent successfully.");

            await loadMessages();
        } catch (err) {
            setError(err.message || "Failed to send message.");
        } finally {
            setSending(false);
        }
    }

    async function handleDelete(messageId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmed) return;

        setError("");
        setNotice("");

        try {
            const response = await fetch(
                `/api/guestbook/messages/${encodeURIComponent(messageId)}`,
                { method: "DELETE" }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete message.");
            }

            setMessages((current) =>
                current.filter((message) => message.id !== messageId)
            );

            setNotice("Message deleted.");
        } catch (err) {
            setError(err.message || "Failed to delete message.");
        }
    }

    return (
        
        <section className="guestbook">
            <div className="guestbook-heading">
                <h2>Guestbook</h2>
                <span>{messages.length} / 50</span>
            </div>

            <form className="guestbook-form" onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Leave a message..."
                    maxLength={500}
                    rows={3}
                    required
                    aria-label="Message"
                />

                <div className="guestbook-form-footer">
                    <span>{content.length}/500</span>

                    <button type="submit" disabled={sending}>
                        {sending ? "Sending..." : "Send message"}
                    </button>
                </div>
            </form>

            {error && (
                <p className="guestbook-error" role="alert">
                    {error}
                </p>
            )}

            {notice && (
                <p className="guestbook-notice" role="status">
                    {notice}
                </p>
            )}

            <div className="guestbook-messages">
                {loading ? (
                    <p className="guestbook-muted">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="guestbook-muted">
                        No messages yet. Be the first to leave one!
                    </p>
                ) : (
                    messages.map((message) => (
                        <article
                            className="guestbook-message"
                            key={message.id}
                        >
                            <div className="guestbook-message-header">
                                <strong>{message.authorName}</strong>

                                <time dateTime={message.createdAt}>
                                    {new Date(
                                        message.createdAt
                                    ).toLocaleDateString()}
                                </time>
                            </div>

                            <p>{message.content}</p>

                            {isOwner && (

                            <button
                                type="button"
                                className="guestbook-delete"
                                onClick={() => handleDelete(message.id)}
                                aria-label="Delete message"
                                title="Delete message"
                            >
                                <Trash2 size={16} strokeWidth={1.8} />
                            </button>

                            )}
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}
