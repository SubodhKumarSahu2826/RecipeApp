import { Search } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { getRandomColor } from "../lib/utils";

// Replace with your verified API credentials from Edamam
const APP_ID = "9ab480b2"; // Verify this in the Edamam dashboard
const APP_KEY = "66b25c8ad583c252224d20e0e5d62fd2"; // Verify this in the Edamam dashboard

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch recipes
    const fetchRecipes = async (searchQuery) => {
        setLoading(true);
        setError(null);
        setRecipes([]);
        const apiUrl = `https://api.edamam.com/api/recipes/v2?app_id=${APP_ID}&app_key=${APP_KEY}&q=${searchQuery}&type=public`;

        try {
            const res = await fetch(apiUrl);

            // Debugging response status
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Unauthorized: Check your API ID and Key.");
                } else {
                    throw new Error(`Failed with status ${res.status}`);
                }
            }

            const data = await res.json();

            // Check if recipes are found
            if (!data.hits || data.hits.length === 0) {
                setError("No recipes found. Try a different search term.");
            } else {
                setRecipes(data.hits);
            }
        } catch (error) {
            console.error("API Error:", error.message);
            setError(error.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch default recipes on component mount
    useEffect(() => {
        fetchRecipes("chicken");
    }, []);

    // Handle search input
    const handleSearchRecipe = (e) => {
        e.preventDefault();
        const searchQuery = e.target[0].value.trim();
        if (searchQuery) {
            fetchRecipes(searchQuery);
        } else {
            setError("Please enter a valid search term.");
        }
    };

    return (
        <div className="bg-[#faf9fb] p-10 flex-1">
            <div className="max-w-screen-lg mx-auto">
                {/* Search Form */}
                <form onSubmit={handleSearchRecipe}>
                    <label className="input shadow-md flex items-center gap-2">
                        <Search size={"24"} />
                        <input
                            type="text"
                            className="text-sm md:text-md grow"
                            placeholder="What do you want to cook today?"
                        />
                    </label>
                </form>

                {/* Title and Subtitle */}
                <h1 className="font-bold text-3xl md:text-5xl mt-4">Recommended Recipes</h1>
                <p className="text-slate-500 font-semibold ml-1 my-2 text-sm tracking-tight">
                    Popular choices
                </p>

                {/* Error State */}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {/* Loading State */}
                {loading && <p className="text-blue-500 mt-4">Loading recipes...</p>}

                {/* Recipes Grid */}
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {!loading && !error &&
                        recipes.map(({ recipe }, index) => (
                            <RecipeCard key={index} recipe={recipe} {...getRandomColor()} />
                        ))}

                    {/* Fallback Skeleton UI */}
                    {loading &&
                        [...Array(9)].map((_, index) => (
                            <div key={index} className="flex flex-col gap-4 w-full">
                                <div className="skeleton h-32 w-full"></div>
                                <div className="flex justify-between">
                                    <div className="skeleton h-4 w-28"></div>
                                    <div className="skeleton h-4 w-24"></div>
                                </div>
                                <div className="skeleton h-4 w-1/2"></div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
