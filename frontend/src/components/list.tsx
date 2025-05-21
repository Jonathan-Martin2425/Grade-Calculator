interface ListItemProps {
    name: string,
    onClick?: () => void,
}

interface ListProps {
    title: string,
    items: ListItemProps[],
    isHeader: boolean,
}

function List(props: ListProps){
    let containerClass = "column-container";
    if(props.isHeader){
        containerClass = "header-container";
    }

    return (
        <fieldset className={containerClass} id={props.title}>
            {props.items.map((item: ListItemProps) => {
                return (
                    <a className="list-item" onClick={item.onClick ? item.onClick : () => console.log("hello world")}>
                        {item.name}
                    </a>
                );
            })}
            <input type="button" className="button list-item" id={"create-" + props.title} value="+"/>
        </fieldset>
    );
}

export default List;