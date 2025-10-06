'use client'
import { useState } from "react";

export default function MagicHourPage() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [excuses, setExcuses] = useState(null);
    
    const categories = ["frontend", "backend", "devops", "qa", "management", "funny"];

    // Fetch excuses on component mount
    useState(() => {
        fetch('/excuses.json')
            .then(res => res.json())
            .then(data => setExcuses(data))
            .catch(err => setError("Failed to load excuses."));
    }, []);

    const getRandomExcuse = (category) => {
        if (!excuses || !excuses[category]) return "";
        const categoryExcuses = excuses[category];
        const randomIndex = Math.floor(Math.random() * categoryExcuses.length);
        return categoryExcuses[randomIndex];
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedCategory) return;
        
        setLoading(true);
        setError("");
        setImageUrl("");
        
        const randomExcuse = getRandomExcuse(selectedCategory);
        if (!randomExcuse) {
            setError("Failed to get a random excuse.");
            setLoading(false);
            return;
        }

        console.log(`Selected category: ${selectedCategory}`);
        console.log(`Random excuse: "${randomExcuse}"`);

        const generatedPrompt = `create a meme about programming with text "${randomExcuse}" with funny background`;
        
        try {
            const res = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: generatedPrompt }),
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
            <h1 className="text-2xl font-bold mb-4">IT Excuses Generator</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 w-full max-w-2xl">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`p-4 rounded capitalize text-center text-sm min-w-[160px] min-h-[60px] ${
                            selectedCategory === category
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded" 
                    disabled={loading || !selectedCategory}
                >
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
