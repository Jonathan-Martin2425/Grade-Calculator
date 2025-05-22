import { Link } from "react-router";


export interface ListItemProps {
    name: string,
    linkTo?: string,
    onClick?: () => void,
}

interface ListProps {
    title: string,
    linkTo: string,
    items: ListItemProps[],
    isHeader: boolean,
    currentItem?: string,
}

function List(props: ListProps){
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
                    <Link to={item.linkTo ? props.linkTo + item.linkTo : props.linkTo} className={"list-item" + selected} onClick={item.onClick ? item.onClick : () => console.log("hello world")}>
                        {item.name}
                    </Link>
                );
            })}
            <input type="button" className="button list-item" id={"create-" + props.title} value="+"/>
        </fieldset>
    );
}

export default List;