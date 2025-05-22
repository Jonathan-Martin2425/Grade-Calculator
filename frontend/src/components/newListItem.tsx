import { useState } from "react";
import type { ListItemProps } from "./list";

interface newListItemProps {
    onClick: (data: ListItemProps) => void,
    isHeader?: boolean,
}

function NewListItem(props: newListItemProps){
    const [text, setText] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setText(e.target.value);
    }

    let cssClass = "text-input";
    if(props.isHeader){
        cssClass = "header-text-input"
    }

    return (
        <div className={"text-input"}>
            <input className={cssClass} type="text" placeholder="Enter Here" value={text} onChange={handleChange}></input>
            <input type="button" className="button list-item" id={"create-input"} value="+" onClick={() => props.onClick({name: text})}/>
        </div>
    );
}

export default NewListItem;