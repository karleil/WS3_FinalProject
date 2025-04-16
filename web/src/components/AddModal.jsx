//this file is similar if not identitical to delete and edit modal.
import { useState } from "react";
import { createPortal } from "react-dom";
import AddModalContent from "./AddModalContent";

export default function AddModal({ onMangaAdded }) {

    const [showModal, setShowModal] = useState(false);
    
    return (
        <>
            <button className="border bg-gray-700 text-2xl text-white p-1 cursor-pointer rounded hover:bg-gray-300 hover:text-black" onClick={() => { setShowModal(true) }}>Add Manga</button>

            {showModal && createPortal(
                <AddModalContent
                    onMangaAdded={onMangaAdded}
                    onClose={() => { setShowModal(false) }}
                />,
                document.body
            )}
        </>
    )
}