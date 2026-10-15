    "use client";

    import { useEffect, useState } from "react";
    import Link from "next/link";
    import "./dashboard.css";
    import { Mail } from 'lucide-react';
    import { User } from 'lucide-react';
    import { RotateCcwKey } from 'lucide-react';
    import { Trash } from 'lucide-react';
    import {
        siGithub,
        siTelegram,
        siDiscord,
        siYoutube,
        siInstagram,
        siTiktok,
        siSpotify,
        siTwitch,
        siX,
        siVk,
        siReddit,
        siSteam,
        siSoundcloud,
        siPinterest,
        siFacebook,
        siSnapchat,
        siWhatsapp,
        siGitlab,
        siBitbucket,
        siDribbble,
        siBehance,
        siMedium,
        siPatreon,
        siKick,
        siThreads,
        siBluesky,
        siTumblr,
        siMastodon
    } from "simple-icons";

    const COLORS = [
        "#FFFFFF",
        "#E5E7EB",
        "#9CA3AF",
        "#60A5FA",
        "#3B82F6",
        "#818CF8",
        "#A78BFA",
        "#C084FC",
        "#F472B6",
        "#FB7185",
        "#F87171",
        "#FB923C",
        "#FACC15",
        "#4ADE80",
        "#34D399",
        "#2DD4BF",
        "#22D3EE"
    ];

    const LINK_ICONS = {
        github: siGithub,
        telegram: siTelegram,
        discord: siDiscord,
        youtube: siYoutube,
        instagram: siInstagram,
        tiktok: siTiktok,
        spotify: siSpotify,
        twitch: siTwitch,
        twitter: siX,
        vk: siVk,
        reddit: siReddit,
        steam: siSteam,
        soundcloud: siSoundcloud,
        pinterest: siPinterest,
        facebook: siFacebook,
        snapchat: siSnapchat,
        whatsapp: siWhatsapp,
        gitlab: siGitlab,
        bitbucket: siBitbucket,
        dribbble: siDribbble,
        behance: siBehance,
        medium: siMedium,
        patreon: siPatreon,
        kick: siKick,
        threads: siThreads,
        bluesky: siBluesky,
        tumblr: siTumblr,
        mastodon: siMastodon
    };

    function LinkIcon({ name, className = "social-icon" }) {
        const icon = LINK_ICONS[name];

        if (!icon) {
            return <span>↗</span>;
        }

        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={className}
            >
                <path d={icon.path} />
            </svg>
        );
    }

    function ColorPicker({ value, onChange, open, setOpen }) {
        const currentColor = value || "#FFFFFF";

        return (
            <div className="custom-color-picker">
                <button
                    type="button"
                    className="color-trigger"
                    onClick={() => setOpen(!open)}
                >
                    <span
                        className="color-preview"
                        style={{ background: currentColor }}
                    />
                    <span>{currentColor}</span>
                    <span className="color-arrow">
                        {open ? "⌃" : "⌄"}
                    </span>
                </button>

                {open && (
                    <div className="color-panel">
                        <div className="color-grid">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-item ${
                                        currentColor.toUpperCase() === color
                                            ? "selected"
                                            : ""
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        onChange(color);
                                        setOpen(false);
                                    }}
                                />
                            ))}
                        </div>

                        <div className="custom-color">
                            <span>Custom color</span>
                            <input
                                type="color"
                                value={currentColor}
                                onChange={(e) =>
                                    onChange(e.target.value.toUpperCase())
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    export default function DashboardClient({ user }) {
        const [activeTab, setActiveTab] = useState("overview");

        const [profile, setProfile] = useState({
            description: "",
            avatar: "",
            background: "",
            font: "Manrope",
            textColor: "#ffffff",
            descriptionColor: "#ffffff",
            iconColor: "#ffffff",
            backgroundType: "image",
            musicUrl:"",
            musicTitle:"",
            musicArtist:"",
            musicCover:"",

        });

        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [message, setMessage] = useState("");
        const [colorPickerOpen, setColorPickerOpen] = useState(null);
        const [links, setLinks] = useState([]);
        const [linksLoading, setLinksLoading] = useState(false);
        const [linkModalOpen, setLinkModalOpen] = useState(false);
        const [editingLink, setEditingLink] = useState(null);
        const [username, setUsername] = useState(user.username);
        const [newUsername, setNewUsername] = useState(user.username);
        const [currentPassword, setCurrentPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [settingsMessage, setSettingsMessage] = useState("");
        const [settingsLoading, setSettingsLoading] = useState(false);

        const [analytics, setAnalytics] = useState({
            views: 0,
            dailyViews: [],
            loading: true,
            error: ""
        });

        const [linkForm, setLinkForm] = useState({
            title: "",
            url: "",
            icon: "github"
        });

      
useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
        try {
            const response = await fetch("/api/analytics", {
                cache: "no-store"
            });

            const data = await response.json();

         if (!response.ok) {
    console.error("Analytics API error:", {
        status: response.status,
        data
    });

    throw new Error(
        `Analytics API error (${response.status}): ${
            data.error || "Unknown error"
        }`
    );
}
            if (cancelled) return;

            setAnalytics({
                views: Number(data.views ?? 0),
                dailyViews: Array.isArray(data.dailyViews)
                    ? data.dailyViews
                    : [],
                loading: false,
                error: ""
            });
        } catch (error) {
            console.error("ANALYTICS_LOAD_ERROR:", error);

            if (cancelled) return;

            setAnalytics((prev) => ({
                ...prev,
                loading: false,
                error: error.message || "Failed to load analytics."
            }));
        }
    }

    loadAnalytics();

    return () => {
        cancelled = true;
    };
}, []);


        useEffect(() => {
            async function loadProfile() {
                try {
                    const response = await fetch("/api/profile");

                    if (!response.ok) {
                        throw new Error("Failed to load profile");
                    }

                    const data = await response.json();

                    if (data.profile) {
                        setProfile({
                            description: data.profile.description || "",
                            avatar: data.profile.avatar || "",
                            background: data.profile.background || "",
                            backgroundType: data.profile.backgroundType || "image",
                            font: data.profile.font || "Manrope",
                            textColor: data.profile.textColor || "#ffffff",
                            descriptionColor:data.profile.descriptionColor || "#ffffff",
                            iconColor:data.profile.iconColor || "#ffffff",
                            musicUrl: data.profile.musicUrl || "",
                            musicTitle: data.profile.musicTitle || "",
                            musicArtist: data.profile.musicArtist || "",
                            musicCover: data.profile.musicCover || ""
                        });
                    }
                } catch (error) {
                    console.error("PROFILE_LOAD_ERROR:", error);
                } finally {
                    setLoading(false);
                }
            }

            loadProfile();
        }, []);

        useEffect(() => {
            async function loadLinks() {
                setLinksLoading(true);

                try {
                    const response = await fetch("/api/links");

                    if (!response.ok) {
                        throw new Error("Failed to load links");
                    }

                    const data = await response.json();
                    setLinks(data.links || []);
                } catch (error) {
                    console.error("LINKS_LOAD_ERROR:", error);
                } finally {
                    setLinksLoading(false);
                }
            }

            loadLinks();
        }, []);

        function updateProfile(field, value) {
            setProfile((prev) => ({
                ...prev,
                [field]: value,
            }));
        }

        function toggleColorPicker(name) {
            setColorPickerOpen((current) =>
                current === name ? null : name
            );
        }

        async function uploadImage(file, type) {
            if (!file) return;

            setMessage("");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });

                const text = await response.text();

                let data;

                try {
                    data = JSON.parse(text);
                } catch {
                    throw new Error(text || "Не удалось загрузить файл");
                }

                if (!response.ok) {
                    throw new Error(data.error || "Ошибка загрузки");
                }   
                console.log("UPLOAD RESPONSE:", data);

                if (!response.ok) {
                    throw new Error(data.error || "Upload failed");
                }
                const isVideo = file.type.startsWith("video/");

                   
                setProfile((prev) => {
                    const updated = {
                        ...prev,
                        ...(type === "music"
                            ? {
                                musicUrl: data.url,
                                musicCover: data.coverUrl || ""
                            }
                            : {
                                [type]: data.url
                            }),
                        ...(type === "background"
                            ? {
                                backgroundType: isVideo ? "video" : "image"
                            }
                            : {})
                    };

                    console.log("PROFILE AFTER UPLOAD:", {
                        musicUrl: updated.musicUrl,
                        musicCover: updated.musicCover
                    });

                    return updated;
                });

                setMessage(
                    type === "avatar"
                        ? "Avatar uploaded successfully."
                        : "Background uploaded successfully."
                );
            } catch (error) {
                console.error(error);
                setMessage(error.message);
            }
        }



 async function getMusicCover(file) {
    try {
        const module = await import("jsmediatags/dist/jsmediatags.min.js");
        const jsmediatags = module.default || module;

        return await new Promise((resolve) => {
            jsmediatags.read(file, {
                onSuccess: (result) => {
                    const picture = result.tags.picture;

                    if (!picture) {
                        resolve(null);
                        return;
                    }

                    const imageData = new Uint8Array(picture.data);
                    const blob = new Blob([imageData], {
                        type: picture.format || "image/jpeg"
                    });

                    resolve(blob);
                },
                onError: (error) => {
                    console.error("MUSIC_COVER_ERROR:", error);
                    resolve(null);
                }
            });
        });
    } catch (error) {
        console.error("MUSIC_TAGS_IMPORT_ERROR:", error);
        return null;
    }
}

async function uploadMusicCover(file, signatureData) {
    try {
        const cover = await getMusicCover(file);

        if (!cover) {
            return "";
        }

        const formData = new FormData();
        formData.append("file", cover, "cover.jpg");
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", String(signatureData.timestamp));
        formData.append("signature", signatureData.signature);
        formData.append("folder", signatureData.folder);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("COVER_UPLOAD_ERROR:", data);
            return "";
        }

        return data.secure_url || "";
    } catch (error) {
        console.error("COVER_UPLOAD_ERROR:", error);
        return "";
    }
}

async function uploadMusic(file) {
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
        setMessage("Select an audio file.");
        return;
    }

    if (file.size > 20 * 1024 * 1024) {
        setMessage("The music file size should not exceed 20 MB.");
        return;
    }

    try {
        setMessage("Preparing music upload...");
        const signatureResponse = await fetch("/api/upload-signature", {
            method: "POST"
        });

        const signatureData = await signatureResponse.json();

        if (!signatureResponse.ok) {
            throw new Error(
                signatureData.error || "Could not prepare the upload."
            );
        }
        setMessage("Uploading music...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", String(signatureData.timestamp));
        formData.append("signature", signatureData.signature);
        formData.append("folder", signatureData.folder);

        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/video/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
            throw new Error(
                uploadData.error?.message || "The music could not be uploaded."
            );
        }

        if (!uploadData.secure_url) {
            throw new Error("Cloudinary did not return the music URL.");
        }
        setMessage("Music uploaded. Processing cover...");

        const musicCover = await uploadMusicCover(file, signatureData);

        setProfile((prev) => ({
            ...prev,
            musicUrl: uploadData.secure_url,
            musicCover
        }));

        setMessage(
            musicCover
                ? "Music and cover uploaded. Click Save changes."
                : "Music uploaded without an embedded cover. Click Save changes."
        );
    } catch (error) {
        console.error("MUSIC_UPLOAD_ERROR:", error);
        setMessage(error.message || "Music upload failed.");
    }
}

async function saveUsername() {
    setSettingsLoading(true);
    setSettingsMessage("");

    try {
        const response = await fetch("/api/settings", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: newUsername
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Failed to update username"
            );
        }

        setUsername(data.user.username);
        setNewUsername(data.user.username);
        setSettingsMessage("Username updated successfully.");
    } catch (error) {
        setSettingsMessage(error.message);
    } finally {
        setSettingsLoading(false);
    }
}

    const saveProfile = async () => {
        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profile)
            });

            const data = await response.json();
            console.log("SENDING MUSIC COVER:", profile.musicCover);
            console.log("SAVED MUSIC COVER:", data.profile?.musicCover);

            console.log("PROFILE SAVE RESPONSE:", data);

            if (!response.ok) {
                throw new Error(data.error || "Failed to save profile");
            }

            setProfile(data.profile);
            setMessage("Profile saved successfully");
        } catch (error) {
            console.error("SAVE PROFILE ERROR:", error);
            setMessage(error.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

        async function logout() {
            await fetch("/api/logout", {
                method: "POST"
            });

            window.location.href = "/";
        }

        function openAddLink() {
            if (links.length >= 5) {
                alert("You can add up to 5 links.");
                return;
            }

            setEditingLink(null);
            setLinkForm({
                title: "",
                url: "",
                icon: "github"
            });
            setLinkModalOpen(true);
        }

        function openEditLink(link) {
            setEditingLink(link);
            setLinkForm({
                title: link.title,
                url: link.url,
                icon: link.icon
            });
            setLinkModalOpen(true);
        }

        async function saveLink() {
            if (!linkForm.title || !linkForm.url || !linkForm.icon) {
                return;
            }

            try {
                const response = await fetch("/api/links", {
                    method: editingLink ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        editingLink
                            ? {
                                id: editingLink.id,
                                ...linkForm
                            }
                            : linkForm
                    )
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to save link"
                    );
                }

                if (editingLink) {
                    setLinks((prev) =>
                        prev.map((link) =>
                            link.id === editingLink.id
                                ? data.link
                                : link
                        )
                    );
                } else {
                    setLinks((prev) => [...prev, data.link]);
                }

                setLinkModalOpen(false);
                setEditingLink(null);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }

        async function deleteLink(id) {
            try {
                const response = await fetch("/api/links", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to delete link"
                    );
                }

                setLinks((prev) =>
                    prev.filter((link) => link.id !== id)
                );
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }

        return (
            <main className="dashboard">
                <aside className="dashboard-sidebar">
                    <a href="/" className="dashboard-logo">
                        <img src="/logo.png" alt="Linxy" />
                        <span>Linxy</span>
                    </a>

                    <div className="dashboard-user">
                        <div className="dashboard-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{user.username}</strong>
                            <span>UID #{user.uid}</span>
                        </div>
                    </div>

                    <nav className="dashboard-nav">
                        {[
                            ["overview", "Overview"],
                            ["profile", "Profile"],
                            ["links", "Links"],
                            ["music", "Music"],
                            ["settings", "Settings"]
                        ].map(([tab, label]) => (
                            <button
                                key={tab}
                                className={
                                    activeTab === tab ? "active" : ""
                                }
                                onClick={() => setActiveTab(tab)}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="dashboard-bottom">
                        <Link href={`/${user.username}`}>
                            View profile
                        </Link>

                        <button onClick={logout}>
                            Log out
                        </button>
                    </div>
                </aside>

                <section className="dashboard-content">
               
                    {activeTab === "overview" && (
                        <div className="dashboard-section overview-section">
                            <div className="section-heading">
                                <div>
                                    <span className="eyebrow">Dashboard</span>
                                    <h1>Welcome, {username}</h1>
                                    <p>Manage your Linxy profile and account.</p>
                                </div>

                                <Link className="view-profile" href={`/${username}`}>
                                    View profile
                                </Link>
                            </div>

                            <div className="overview-grid">
                                <div className="dashboard-card">
                                    <span>Username</span>
                                    <strong>{username}</strong>
                                </div>

                                <div className="dashboard-card">
                                    <span>Profile</span>
                                    <strong>/{username}</strong>
                                </div>

                                <div className="dashboard-card views-summary-card">
                                    <span>Total views</span>

                                    <strong>
                                        {analytics.loading
                                            ? "Loading..."
                                            : analytics.error
                                                ? "Unavailable"
                                                : analytics.views.toLocaleString()}
                                    </strong>

                                    <small>
                                        {analytics.error
                                            ? analytics.error
                                            : "All-time profile views"}
                                    </small>
                                </div>
                            </div>

                            <div className="views-chart-card">
                                <div className="views-chart-heading">
                                    <div>
                                        <h2>Profile views</h2>
                                        <p>Daily activity over the last 7 days</p>
                                    </div>

                                    <span className="views-chart-period">Last 7 days</span>
                                </div>

                                {analytics.loading ? (
                                    <p className="views-chart-message">
                                        Loading analytics...
                                    </p>
                                ) : analytics.error ? (
                                    <p className="views-chart-message">
                                        Could not load profile views.
                                    </p>
                                ) : (
                                    <>
                                        <div className="views-chart">
                                            {analytics.dailyViews.map((day) => {
                                                const maxViews = Math.max(
                                                    1,
                                                    ...analytics.dailyViews.map(
                                                        (item) => Number(item.views) || 0
                                                    )
                                                );

                                                const count = Number(day.views) || 0;
                                                const height = count > 0
                                                    ? Math.max(8, (count / maxViews) * 100)
                                                    : 3;

                                                const date = new Date(`${day.date}T00:00:00Z`);

                                                const dayLabel = date.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        weekday: "short",
                                                        timeZone: "UTC"
                                                    }
                                                );

                                                return (
                                                    <div
                                                        className="views-chart-column"
                                                        key={day.date}
                                                    >
                                                        <span className="views-chart-value">
                                                            {count}
                                                        </span>

                                                        <div className="views-chart-bar-area">
                                                            <div
                                                                className={`views-chart-bar ${
                                                                    count === maxViews && count > 0
                                                                        ? "peak"
                                                                        : ""
                                                                }`}
                                                                style={{ height: `${height}%` }}
                                                                title={`${count} views`}
                                                            />
                                                        </div>

                                                        <span className="views-chart-day">
                                                            {dayLabel}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="views-chart-footer">
                                            <span>Views per day</span>

                                            <strong>
                                                {analytics.dailyViews.reduce(
                                                    (total, day) =>
                                                        total + (Number(day.views) || 0),
                                                    0
                                                ).toLocaleString()} views this week
                                            </strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}


                    {activeTab === "profile" && (
                        <div className="dashboard-section">
                            <div className="section-heading">
                                <div>
                                    <span className="eyebrow">
                                        Profile
                                    </span>

                                    <h1>
                                        Customize your profile
                                    </h1>

                                    <p>
                                        Make your Linxy page feel like yours.
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <p className="loading">
                                    Loading profile...
                                </p>
                            ) : (
                                <div className="editor">
                                    <div className="profile-top-row">
                                        <div className="form-group">
                                            <label>Avatar</label>

                                            <label className="upload-box avatar-upload">
                                                {profile.avatar ? (
                                                    <img
                                                        src={profile.avatar}
                                                        alt="Avatar preview"
                                                    />
                                                ) : (
                                                    <div className="upload-placeholder">
                                                        <span>+</span>
                                                        <p>
                                                            Choose avatar
                                                        </p>
                                                        <small>
                                                            PNG, JPG or WebP
                                                        </small>
                                                    </div>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={(e) =>
                                                        uploadImage(
                                                            e.target.files[0],
                                                            "avatar"
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>

                                            <textarea
                                                maxLength={500}
                                                value={profile.description}
                                                onChange={(e) =>
                                                    updateProfile(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Tell people something about yourself..."
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Background</label>

                                       <label className="upload-box background-upload">
                                        {profile.background ? (
                                            profile.backgroundType === "video" ? (
                                                <video
                                                    src={profile.background}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={profile.background}
                                                    alt="Background preview"
                                                />
                                            )
                                        ) : (
                                            <div className="upload-placeholder">
                                                <span>+</span>
                                                <p>Choose background</p>
                                                <small>
                                                    PNG, JPG, WebP, MP4 or WebM
                                                </small>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
                                            onChange={(e) =>
                                                uploadImage(
                                                    e.target.files[0],
                                                    "background"
                                                )
                                            }
                                        />
                                    </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Font</label>

                                        <select
                                            value={profile.font}
                                            onChange={(e) =>
                                                updateProfile(
                                                    "font",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Manrope">
                                                Manrope
                                            </option>
                                            <option value="Inter">
                                                Inter
                                            </option>
                                            <option value="Arial">
                                                Arial
                                            </option>
                                            <option value="Georgia">
                                                Georgia
                                            </option>
                                        </select>
                                    </div>

                                    <div className="profile-colors">
                                        <div className="color-control">
                                            <label>Name color</label>

                                            <ColorPicker
                                                value={profile.textColor}
                                                onChange={(color) =>
                                                    updateProfile(
                                                        "textColor",
                                                        color
                                                    )
                                                }
                                                open={
                                                    colorPickerOpen === "name"
                                                }
                                                setOpen={() =>
                                                    toggleColorPicker("name")
                                                }
                                            />
                                        </div>

                                        <div className="color-control">
                                            <label>
                                                Description color
                                            </label>

                                            <ColorPicker
                                                value={
                                                    profile.descriptionColor
                                                }
                                                onChange={(color) =>
                                                    updateProfile(
                                                        "descriptionColor",
                                                        color
                                                    )
                                                }
                                                open={
                                                    colorPickerOpen ===
                                                    "description"
                                                }
                                                setOpen={() =>
                                                    toggleColorPicker(
                                                        "description"
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="color-control">
                                            <label>Icon color</label>

                                            <ColorPicker
                                                value={profile.iconColor}
                                                onChange={(color) =>
                                                    updateProfile(
                                                        "iconColor",
                                                        color
                                                    )
                                                }
                                                open={
                                                    colorPickerOpen === "icon"
                                                }
                                                setOpen={() =>
                                                    toggleColorPicker("icon")
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="editor-footer">
                                        <span>{message}</span>

                                        <button
                                            onClick={saveProfile}
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save changes"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "links" && (
                        <div className="dashboard-section">
                            <div className="section-heading">
                                <div>
                                    <span className="eyebrow">
                                        Links
                                    </span>

                                    <h1>Social links</h1>

                                    <p>
                                        Add links to your social networks and
                                        websites.
                                    </p>
                                </div>

                                {links.length < 5 && (
                                    <button
                                        className="add-link-button"
                                        onClick={openAddLink}
                                    >
                                        + Add Link
                                    </button>
                                )}
                            </div>

                            {linksLoading ? (
                                <p className="loading">
                                    Loading links...
                                </p>
                            ) : links.length === 0 ? (
                                <div />
                            ) : (
                                <div className="links-list">
                                    {links.map((link) => (
                                        <div
                                            className="link-item"
                                            key={link.id}
                                        >
                                            <div className="link-icon">
                                                <LinkIcon
                                                    name={link.icon}
                                                />
                                            </div>

                                            <div className="link-info">
                                                <strong>
                                                    {link.title}
                                                </strong>

                                                <span>
                                                    {link.url}
                                                </span>
                                            </div>

                                            <div className="link-actions">
                                                <button
                                                    onClick={() =>
                                                        openEditLink(link)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteLink(link.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {linkModalOpen && (
                                <div className="link-modal-overlay">
                                    <div className="link-modal">
                                        <div className="link-modal-header">
                                            <div>
                                                <span className="eyebrow">
                                                    Links
                                                </span>

                                                <h2>
                                                    {editingLink
                                                        ? "Edit link"
                                                        : "Add link"}
                                                </h2>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setLinkModalOpen(false)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="form-group">
                                            <label>Title</label>

                                            <input
                                                type="text"
                                                value={linkForm.title}
                                                placeholder="GitHub"
                                                onChange={(e) =>
                                                    setLinkForm((prev) => ({
                                                        ...prev,
                                                        title: e.target.value
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>URL</label>

                                            <input
                                                type="url"
                                                value={linkForm.url}
                                                placeholder="https://github.com/username"
                                                onChange={(e) =>
                                                    setLinkForm((prev) => ({
                                                        ...prev,
                                                        url: e.target.value
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Icon</label>

                                            <div className="icon-picker">
                                                {Object.entries(LINK_ICONS).map(
                                                    ([name, icon]) => (
                                                        <button
                                                            key={name}
                                                            type="button"
                                                            className={`icon-option ${
                                                                linkForm.icon ===
                                                                name
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                setLinkForm(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        icon: name
                                                                    })
                                                                )
                                                            }
                                                            title={name}
                                                        >
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    d={icon.path}
                                                                />
                                                            </svg>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="link-modal-footer">
                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    setLinkModalOpen(false)
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="save-link-button"
                                                onClick={saveLink}
                                            >
                                                {editingLink
                                                    ? "Save changes"
                                                    : "Add Link"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

  {activeTab === "music" && (
    <div className="dashboard-section">
        <div className="section-heading">
            <div>
                <span className="eyebrow">
                    Music
                </span>

                <h1>Music Player</h1>

                <p>
                    Customize the music on your profile.
                </p>
            </div>
        </div>

        {loading ? (
            <p className="loading">
                Loading profile...
            </p>
        ) : (
            <div className="editor">
                <div className="form-group">
                    <label>Audio file</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            console.log("Выбран файл:", file);
                            console.log("uploadMusic:", typeof uploadMusic);

                            if (file) {
                                uploadMusic(file);
                            }

                            e.target.value = "";
                        }}
                    />


                    {profile.musicUrl && (
                        <span className="field-hint">
                            Audio file uploaded successfully.
                        </span>
                    )}
                </div>


                <div className="form-group">
                    <label htmlFor="music-title">
                        Track title
                    </label>

                    <input
                        id="music-title"
                        type="text"
                        maxLength={30}
                        value={profile.musicTitle}
                        onChange={(e) =>
                            updateProfile(
                                "musicTitle",
                                e.target.value
                            )
                        }
                        placeholder="Enter track title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="music-artist">
                        Artist
                    </label>

                    <input
                        id="music-artist"
                        type="text"
                        maxLength={30}
                        value={profile.musicArtist}
                        onChange={(e) =>
                            updateProfile(
                                "musicArtist",
                                e.target.value
                            )
                        }
                        placeholder="Enter artist name"
                    />
                </div>

                <div className="editor-footer">
                    <span>{message}</span>

                    <button
                        type="button"
                        onClick={saveProfile}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>
        )}
    </div>
)}

                   
{activeTab === "settings" && (
    <div className="dashboard-section settings-page">
        <div className="section-heading">
            <div>
                <span className="eyebrow">Settings</span>
                <h1>Account settings</h1>
                <p>Manage your account and security preferences.</p>
            </div>
        </div>

        <div className="settings-layout">
            <div className="settings-card">
                <div className="settings-card-heading">
                    <div>
                        <h2>Account information</h2>
                        <p>Your personal account details.</p>
                    </div>
                    <span className="settings-icon"><User/></span>
                </div>

                <div className="settings-info-row">
                    <span>Username</span>
                    <strong>{user.username}</strong>
                </div>

                <div className="settings-info-row">
                    <span>User ID</span>
                    <strong>#{user.uid}</strong>
                </div>

                <div className="settings-info-row">
                    <span>Email</span>
                    <strong>{user.email}</strong>
                </div>

                <div className="settings-info-row">
                    <span>Joined</span>
                    <strong>
                        {new Date(user.createdAt).toLocaleDateString()}
                    </strong>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-heading">
                    <div>
                        <h2>Change username</h2>
                        <p>Your username is used in your public profile URL.</p>
                    </div>
                    <span className="settings-icon"><Mail/></span>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    saveUsername();
                }}>
                    <div className="form-group">
                        <label htmlFor="settings-username">
                            New username
                        </label>
                        <input
                            id="settings-username"
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            minLength={3}
                            maxLength={20}
                            pattern="[a-zA-Z0-9_]+"
                            autoComplete="username"
                            required
                        />
                        <span className="field-hint">
                            3–20 characters. Letters, numbers and underscores.
                        </span>
                    </div>

                    <div className="settings-preview">
                        <span>New profile URL</span>
                        <strong>/{newUsername || user.username}</strong>
                    </div>

                    <button
                        className="settings-primary-button"
                        type="submit"
                        disabled={settingsLoading ||
                            newUsername.trim() === user.username}
                    >
                        {settingsLoading ? "Saving..." : "Save username"}
                    </button>

                    <p className="settings-message" aria-live="polite">
                        {settingsMessage}
                    </p>
                </form>
            </div>

            <div className="settings-card">
                <div className="settings-card-heading">
                    <div>
                        <h2>Change password</h2>
                        <p>Choose a new password for your account.</p>
                    </div>
                    <span className="settings-icon"><RotateCcwKey/></span>
                </div>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setSettingsMessage("");

                    if (newPassword !== confirmPassword) {
                        setSettingsMessage("Passwords do not match.");
                        return;
                    }

                    setSettingsLoading(true);

                    try {
                        const response = await fetch(
                            "/api/settings/password",
                            {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    currentPassword,
                                    newPassword
                                })
                            }
                        );

                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(
                                data.error || "Failed to change password."
                            );
                        }

                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setSettingsMessage("Password changed successfully.");
                    } catch (error) {
                        setSettingsMessage(error.message);
                    } finally {
                        setSettingsLoading(false);
                    }
                }}>
                    <div className="form-group">
                        <label htmlFor="current-password">
                            Current password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="new-password">
                            New password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">
                            Confirm new password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        className="settings-primary-button"
                        type="submit"
                        disabled={settingsLoading}
                    >
                        {settingsLoading ? "Updating..." : "Update password"}
                    </button>

                    <p className="settings-message" aria-live="polite">
                        {settingsMessage}
                    </p>
                </form>
            </div>

            <div className="settings-card settings-danger-card">
                <div className="settings-card-heading">
                    <div>
                        <h2>Delete account</h2>
                        <p>
                            Permanently delete your Linxy account and
                            associated data.
                        </p>
                    </div>
                    <span className="settings-icon"><Trash/></span>
                </div>

                <p className="settings-danger-warning">
                    This action cannot be undone. Your profile and account
                    data may be permanently removed.
                </p>

        
                <button
                    type="button"
                    className="settings-danger-button"
                    onClick={async () => {
                        const confirmed = window.confirm(
                            "Are you sure you want to permanently delete your account?"
                        );

                        if (!confirmed) return;

                        const password = window.prompt(
                            "Enter your current password to confirm deletion:"
                        );

                        if (password === null) return;

                        if (!password.trim()) {
                            setSettingsMessage("Password is required.");
                            return;
                        }

                        setSettingsLoading(true);
                        setSettingsMessage("");

                        try {
                            const response = await fetch(
                                "/api/settings/delete-account",
                                {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ password })
                                }
                            );

                            const data = await response.json();

                            if (!response.ok) {
                                throw new Error(
                                    data.error || "Failed to delete account."
                                );
                            }

                            window.location.replace("/");
                        } catch (error) {
                            setSettingsMessage(error.message);
                        } finally {
                            setSettingsLoading(false);
                        }
                    }}
                    disabled={settingsLoading}
                >
                    {settingsLoading ? "Deleting..." : "Delete account"}
                </button>

                <p className="settings-message" aria-live="polite">
                    {settingsMessage}
                </p>

            </div>
        </div>
    </div>
)}

                </section>
            </main>
        );
    }