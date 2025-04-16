//Home is the homepage, 
import { useState, useEffect } from "react";
import { Link } from "react-router";
import Filter from "./Filter";
import AddModal from "./AddModal"; //many of the modals are imported to be used in the home page.
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
export default function Home() {

    const [guitar, setGuitars] = useState([]);

    const fetchGuitar = async () => { 
        fetch("http://localhost:3000/guitar", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
            }
        })
            .then(response => response.json())
            .then((jsonData) => {
                setGuitars(jsonData);
            })
    }

    useEffect(() => { //we use useeffect to fetch the guitar when the component mounts, using the function above.

        fetchGuitar();

    }, []);

    return (
        <>


            <div className="grid grid-cols-4 min-h-screen max-w-[1200px] w-full mx-auto my-0 px-4 py-0 mt-10">

                <Filter updateGuitar={setGuitars} ></Filter>


                <div className="col-span-3">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-5xl ">Guitar</h1>
                        <AddModal onGuitarAdded={fetchGuitar} />
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                        {Array.isArray(guitar) && guitar.length > 0 ? (
                            guitar.map(guitar => (// .map is used to extract the guitar array and creates a new array from the elements
                        
                        <div key={guitar.id}> {/*key is used for each guitar, and we use .id to get the information in each guitar.*/}
                            <div className="col-span-1 bg-white border">
                                <img src={`http://localhost:3000/images/${guitar.image_name}`} />
                                <div className="p-2">
                                    <h4 className="text-3xl">{guitar.name}</h4>
                                    <p className="text-xl">{guitar.author}</p>
                                    <p className="text-lg">{guitar.genre}</p>

                                    <div className="flex gap-1">
                                        <button className="border bg-gray-800 p-1 hover:bg-green-500 text-white hover:text-black rounded"><Link to={`/guitar/${guitar.id}`}>View</Link></button>
                                        <EditModal onGuitarUpdated={fetchGuitar} guitar={guitar} /> {/* using edit and delete modals as child components, they handle editing the guitar details and deleting them*/}
                                        <DeleteModal onGuitarDeleted={fetchGuitar} guitar={guitar} />

                                    </div>
                                </div>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>No guitar found.</p>
                    )}
                    </div>
                </div>
            </div>

            <footer className="bg-gray-800 text-white p-4 flex flex-col md:flex-row md:justify-center items-center text-center">Copyright 2025</footer>
        </>
    )
}