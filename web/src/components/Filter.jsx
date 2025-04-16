import { useState, useEffect } from "react";

export default function Filter({ updateManga }) { //update manga is a prop that passed from the parent component to update the list
    const [brand, setBrand] = useState([]); // brand handles the brands stored from the API

    useEffect(() => {
        fetch("http://localhost:3000/brand")
            .then((response) => response.json())
            .then(data => {
                setBrand(data);
            });
    }, []);

    //this function handles the form submission for the filters
    const filterSubmit = (event) => {
        event.preventDefault(); // Prevents the form from refreshing the page

        const filterFormData = new FormData(event.target); // Creates a new Form Data object
        const selectedBrand = filterFormData.getAll("brand"); // Gets all the selected brands

        const queryArtist = selectedBrand.map((id) => `brand=${id}`).join("&"); // Creates query parameters

        fetch(`http://localhost:3000/guitar?${queryArtist}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
            }
        })
            .then((response) => response.json())
            .then((data) => updateManga(data)); // Updates the manga list with the fetched data
    };

    return (
        <filter className="col-span-1">
            <h1 className="text-left text-5xl pb-10">Filter</h1>
            <form onSubmit={filterSubmit}>
                <div className="border-b pb-2 max-w-[75%]">
                    <h2 className="text-2xl">Author</h2>
                    <div className="mt-2">
                        {brand.map((author) => (
                            <label className="text-xl flex items-center gap-2" key={author.id}>
                                <input type="checkbox" name="brand" value={author.id} />
                                {author.name}
                            </label>
                        ))}
                    </div>
                </div>
                <input type="submit" value="Apply" className="mt-4 bg-gray-700 text-white p-2 rounded cursor-pointer hover:bg-gray-300 hover:text-black border" />
            </form>
        </filter>
    );
}