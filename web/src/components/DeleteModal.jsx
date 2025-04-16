//this file is similar if not identitical to add and edit modal.
import { useState } from "react"
import { createPortal } from "react-dom"
import DeleteModalContent from "./DeleteModalContent";

export default function DeleteModal({ manga, onMangaDeleted }) {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className="border bg-gray-800 p-1 text-white hover:bg-red-500 hover:text-black cursor-pointer rounded" onClick={ () => {setShowModal(true) }}>Delete</button>

            {showModal && createPortal( 
                <DeleteModalContent
                manga={manga}
                onMangaDeleted={onMangaDeleted}
                onClose={ () => { setShowModal( false ) }}
                />,
                document.body
            )}
        </>
    )
}
