// this file handles the appearance of the edit modal
import { useState } from "react"
import { createPortal } from "react-dom" // createportal is used to render the modal
import EditModalContent from "./EditModalContent";

export default function EditModal({ manga, onMangaUpdated }) { //this takes the child components to be used in this modal

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className="border bg-gray-800 p-1 text-white hover:bg-yellow-500 hover:text-black cursor-pointer rounded" onClick={ () => {setShowModal(true) }}>Edit</button> {/* this line of code enables the edit content to be visible, via onclick and setting the state to true.*/}

            {showModal && createPortal( //conditional statement to render the modal if show modal is true
                <EditModalContent
                manga={manga} //passes the manga object to the modal
                onMangaUpdated={onMangaUpdated} //this is used to pass the onmangaupdated callback to refresh the manga list after its been edited
                onClose={ () => { setShowModal( false ) }}
                />,
                document.body
            )}
        </>
    )
}
