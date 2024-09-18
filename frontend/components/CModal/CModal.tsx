import React from "react"
import "./CModal.css"
import { Button } from "@mui/material"

interface CModalProps {
    children: React.ReactNode
    onClose: () => void,
    title: string
}

const CModal = (props: CModalProps) => {

    return (
        <div className="parentDiv">
            <div className="modalDismiss" onClick={props.onClose} />
            <div className="modalView">
                <div className="modalHeader">
                    <h3>{props.title}</h3>
                    <Button onClick={props.onClose} variant="text" className="bttnClose" >X</Button>
                </div>

                <div className="modalBody">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default CModal