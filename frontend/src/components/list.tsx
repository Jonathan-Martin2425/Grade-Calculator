import { Link } from "react-router";
import type { IApiSchoolData, Quarter } from "../../../backend/src/common/ApiImageData";
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
    doCrudOperation: (position: SchoolPosition, operation: string, data1: ListItemProps, data2?: IApiSchoolData | Quarter | ListItemProps) => void,
    currentItem?: string,
    resetEditing?: () => void,
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
            props.doCrudOperation(position, "create", data);
        }
        setIsAddingItem(false);
    }

    function deleteItem(item: ListItemProps){
        if(props.currentItem !== item.name){
            props.doCrudOperation(props.position, "delete", item);
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
                    <div className={containerClass + "-list-item"}>
                        <Link key={item.name} to={props.linkTo + item.name} onClick={props.resetEditing} className={selected}>
                            {item.name}
                        </Link>
                        <input 
                            type="button" 
                            className="button" 
                            id={"delete-" + props.title} 
                            value="-" 
                            onClick={() => deleteItem(item)}
                        />
                    </div>
                );
            })}
            {createElement}
        </fieldset>
    );
}

export default List;