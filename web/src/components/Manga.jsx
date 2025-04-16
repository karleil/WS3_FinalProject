//this file is used to show the details of the individual manga.

import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";

export default function Manga() {
    const { id } = useParams(); //use params is used to extract the id of the manga from the URL
    const [mangaData, setMangaData] = useState([]); //usestate is used to store the manga data.


    useEffect(() => {
        fetch(`http://localhost:3000/manga/${id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
            }
        }) //fetch is used to get the API
            .then(res => res.json()) //res.json parses the response as JSON data
            .then(data => {
                setMangaData(data); //using state, it updates setmangadata with the fetched data.
            })
    }, []);


    return (
        <>
        
            <div className="min-h-screen max-w-[1200px] w-full mx-auto  mt-10">


                <button className="mt-4 bg-gray-700 text-white p-2 rounded cursor-pointer hover:bg-gray-300 hover:text-black border"> <Link to="/manga">Back</Link></button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-6 rounded-2xl ">
                    <div className="col-span-1 flex justify-center items-start">
                        <img src={`http://localhost:3000/images/${mangaData.image_name}`} />
                    </div>
                    <div className="col-span-1 md:col-span-3 ">
                        <h1 className="text-4xl font-bold text-gray-800 mb-5">{mangaData.name}</h1>
                        <div className="text-xl text-gray-600">
                            <p className="font-semibold">{mangaData.author}</p>
                            <p className="font-semibold">{mangaData.genre}</p>
                        </div>
                        <h2 className="text-2xl font-semibold mt-6 mb-2">Description</h2>
                        <p  className="text-lg">{mangaData.description}</p>


                    </div>

                </div>

            </div>
            <footer className="bg-gray-800 text-white p-4 flex flex-col md:flex-row md:justify-center items-center text-center">Copyright 2025</footer>
        </>
    )

}