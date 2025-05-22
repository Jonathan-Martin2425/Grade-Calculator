import Header from "../components/header";
import MainContainer from "../components/mainContainer";
import {type ListItemProps} from "../components/list";
import { useParams } from "react-router";
import { Link } from "react-router";

interface QuarterPageProps {
    classes: ListItemProps[];
}

export default function QuarterPage(props: QuarterPageProps){
    const {quarter, classItem} = useParams();
    return [
            <Header title={quarter ? quarter : "No Quarter Given"}>
                <div className="header-container">
                    <Link to="/homepage" className="bigger">Back</Link>
                </div>
            </Header>,
            <MainContainer 
                listName="Classes" 
                linkTo={quarter ? "/quarter/" + quarter + "/" : "/quarter/"} 
                list={props.classes} 
                selectedItem={classItem ? classItem : ""}
            />
        ];
}