import React, { useState, useEffect } from "react";


export default function EditModalContent({ onClose, onMangaUpdated, manga }) {

    const [dbAuthors, setDbAuthors] = useState(""); //as with other files, there is state variables for the author/genre
    const [dbGenres, setDbGenres] = useState("");

    const [author, setAuthor] = useState(""); //these state variables are used for the form inputs
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState(manga.description ?? "");


    const [isNewAuthor, setIsNewAuthor] = useState(false); //isNew author/genre is handled for adding new authors/genres
    const [newAuthor, setNewAuthor] = useState("");

    const [isNewGenre, setIsNewGenre] = useState(false);
    const [newGenre, setNewGenre] = useState("");
    useEffect(() => {
        fetch("http://localhost:3000/authors") //this use effect is used to update the state with fetched authors
            .then((response) => response.json())
            .then(responseJSON => {
                setDbAuthors(responseJSON);
                if (responseJSON.length > 0 && !author) {
                    setAuthor(responseJSON[0].id); //if no author is selected, this defaults the author to an id of 0
                }
            });
    }, [])

    useEffect(() => {
        fetch("http://localhost:3000/genres")
            .then((response) => response.json()) //this use effect works the same as the author, but for genres.
            .then(responseJSON => {
                setDbGenres(responseJSON);
                if (responseJSON.length > 0 && !genre) {
                    setGenre(responseJSON[0].id);
                }
            });
    }, [])

    //these two functions handle the changes of author/genre in the drop down
    const HandleAuthorSelectChange = (eventElement) => {
        if (eventElement.target.value === "-1") { // -1 is used as an id for new author
            setIsNewAuthor(true); //this enables the new author input
            setAuthor("");//this clears the selected author
        } else {
            setIsNewAuthor(false);//this disables the new author input
            setAuthor(eventElement.target.value); // this sets the selected author
        }
    };

    const HandleGenreSelectChange = (eventElement) => {
        if (eventElement.target.value === "-1") {
            setIsNewGenre(true);
            setGenre("");
        } else {
            setIsNewGenre(false);
            setGenre(eventElement.target.value);
        }
    };

    const handleFormSubmit = async (event) => {

        event.preventDefault();

        let author_id = author; //this intitializes the author with the author ID

        if (isNewAuthor) {

            const authorResponse = await fetch("http://localhost:3000/authors", {
                method: "POST", //this is used to establish was request to send, in this case a POST request
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ author_name: newAuthor }) //this sends the new author name to the database as a JSON
            });

            const authorData = await authorResponse.json();

            author_id = authorData.author_id; //this gets the new author ID after the response
        }

        let genre_id = genre; //functionally this the genres code works the same as the author code above

        if (isNewGenre) {


            const genreResponse = await fetch("http://localhost:3000/genres", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ genre_name: newGenre })
            });

            const genreData = await genreResponse.json();

            genre_id = genreData.genre_id;
        }

        const formData = new FormData(); //this is used for the form to edit the data
        formData.append("author_id", author_id); //adds author id, title, image, genre id, and description.
        formData.append("title", title);
        formData.append("image", image);
        formData.append("genre_id", genre_id);
        formData.append("description", description)

        const mangaAPIRequest = await fetch(`http://localhost:3000/manga/${manga.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
            },
            method: "PUT",
            body: formData
        });

        const mangaResult = await mangaAPIRequest.json(); //this parses the entire form into a json format
        onClose(); //closes the modal
        onMangaUpdated();//refreshs the manga list in the home page

    };

    return (
        <div className="fixed inset-0  bg-[rgba(255,255,255,0.9)] flex justify-center items-center left-0 top-0 z-50;">
            <div className="border shadow-2xl bg-gray-200 max-w-[600px] max-h-[90vh] overflow-y-auto relative p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Edit Manga</h1>
                <form action="" onSubmit={handleFormSubmit} encType="multipart/form-data" className="space-y-3">
                    <div>
                        <label htmlFor="author" className="block font-semibold mb-2">Author</label>

                        {!isNewAuthor ? (
                            <select
                                name="author"
                                id="author"
                                value={author}
                                onChange={HandleAuthorSelectChange}
                            >
                                {dbAuthors && dbAuthors.map((author, index) => (
                                    <option key={author.id} value={author.id}>{author.name}</option>
                                ))}
                                <option value="-1">New Author</option>
                            </select>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    name="author"
                                    id="author"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    required
                                    className=" border rounded p-1 gap-5" />
                                <button onClick={() => setIsNewAuthor(false)} className=" border rounded p-1">Show List</button>
                            </>
                        )}
                    </div>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block font-semibold mb-2">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded p-2 h-24">
                        </textarea>
                    </div>
                    <div>
                        <label htmlFor="genre" className="block font-semibold mb-2">Genre</label>
                        {!isNewGenre ? (
                            <select
                                name="genre"
                                id="genre"
                                value={genre}
                                onChange={HandleGenreSelectChange}
                                className="w-full border rounded p-2">
                                {dbGenres && dbGenres.map((genre, index) => (
                                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                                ))}
                                <option value="-1">New Genre</option>
                            </select>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    name="genre"
                                    id="genre"
                                    value={newGenre}
                                    onChange={(e) => setNewGenre(e.target.value)}
                                    required
                                    className=" border rounded p-1 gap-5" />
                                <button onClick={() => setIsNewGenre(false)} className=" border rounded p-1 gap-5">Show List</button>
                            </>
                        )}
                    </div>

                    <div>
                        <label htmlFor="image" className="block font-semibold mb-2"> Current Image</label>

                        <img src={`http://localhost:3000/images/${manga.image_name}`} alt="Placeholder" className="w-50 mb-3" />

                        <label htmlFor="image" className="block font-semibold mb-2"> Upload New Image</label>
                        <input type="file"
                            name="image"
                            id="image"
                            onChange={(e) => setImage(e.target.files[0])}
                            required
                            className="cursor-pointer" />
                    </div>
                    <div>
                        <button type="submit" className="border bg-gray-800 p-1 hover:bg-green-500 text-white text-2xl hover:text-black rounded transition-colors mt-3">Add Manga</button>
                    </div>
                </form>
                <button className="text-[2rem] absolute bg-transparent cursor-pointer border-[none] right-2 top-2 hover:bg-red-500 hover:text-white p-3 transition-colors"
                    onClick={onClose}
                >x</button>
            </div>
        </div>
    )
}