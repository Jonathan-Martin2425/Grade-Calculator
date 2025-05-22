import { Link } from "react-router";
import type { SchoolPosition } from "../App";
import NewListItem from "./newListItem";
import { useState } from "react";


export interface ListItemProps {
    name: string,
}

interface ListProps {
    title: string,
    linkTo: string,
    items: ListItemProps[],
    isHeader: boolean,
    position: SchoolPosition,
    addNewItem: (data: ListItemProps, position: SchoolPosition) => void,
    currentItem?: string,
}

function List(props: ListProps){
    const [isAddingItem, setIsAddingItem] = useState(false);

    let createElement  = (<input type="button" className="button list-item" id={"create-" + props.title} value="+" onClick={startAddingItem}/>);
    if(isAddingItem){
        createElement = <NewListItem onClick={(data: ListItemProps) => finishAddingItem(data, props.position)}/>
    }

    function startAddingItem(){
        setIsAddingItem(true);
    }

    function finishAddingItem(data: ListItemProps, position: SchoolPosition){
        if(data.name !== ""){
            props.addNewItem(data, position);
            setIsAddingItem(false);
        }
    }

    let containerClass = "column-container";
    if(props.isHeader){
        containerClass = "header-container";
    }

    return (
        <fieldset className={containerClass} id={props.title}>
            {props.items.map((item: ListItemProps) => {
                let selected: string = "";
                if(props.currentItem ? props.currentItem === item.name : false){
                    selected = " selected";
                }
                
                return (
                    <div className="list-item-container">
                        <Link key={item.name} to={props.linkTo + item.name} className={selected}>
                            {item.name}
                        </Link>
                        <input type="button" className="button" id={"delete-" + props.title} value="-" onClick={() => console.log("delete")}/>
                    </div>
                );
            })}
            {createElement}
        </fieldset>
    );
}

export default List;