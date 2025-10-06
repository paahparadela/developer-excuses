'use client'
import { useState } from "react";

export default function MagicHourPage() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setImageUrl("");
        try {
            const res = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (res.ok && data.downloadedPaths && data.downloadedPaths[0]) {
                setImageUrl(`/outputs/${data.downloadedPaths[0].split("outputs/")[1]}`);
            } else {
                setError(data.error || "Failed to generate image.");
            }
        } catch (err) {
            setError("Request failed.");
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">IT Memes Generator</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Enter your prompt..."
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
                    {loading ? "Generating..." : "Generate Meme"}
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {imageUrl && (
                <div className="mt-8">
                    <img src={imageUrl} alt="IT Memes Generator" className="max-w-full rounded shadow" />
                </div>
            )}
        </div>
    );
}
