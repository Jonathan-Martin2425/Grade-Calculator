import Header from "../components/header";
import MainContainer from "../components/mainContainer";
import { useParams } from "react-router";
import { Link } from "react-router";
import { type Quarter, type School, type SchoolPosition } from "../App";
import type { ListItemProps } from "../components/list";

interface QuarterPageProps {
    quarters: Quarter[],
    position: SchoolPosition,
    doCrudOperation: (position: SchoolPosition, operation: string, data1: ListItemProps, data2?: School | Quarter | ListItemProps) => void,
}

export default function QuarterPage(props: QuarterPageProps){
    const {quarter, classItem} = useParams();

    // gets current quarter index from quarter name in quarter.name
    let currentQuarterIndex: number = 0;
    for(let i in props.quarters){
        if(props.quarters[i].name === quarter){
            currentQuarterIndex = Number(i);
        }
    }

    const newPosition: SchoolPosition = {
        school: props.position.school,
        quarter: props.quarters[currentQuarterIndex].name,
    }

    return [
            <Header title={quarter ? quarter : "No Quarter Given"}>
                <div className="header-container">
                    <Link to="/homepage" className="bigger">Back</Link>
                </div>
            </Header>,
            <MainContainer 
                listName="Classes" 
                linkTo={quarter ? "/quarter/" + quarter + "/class/" : "/quarter/"} 
                list={props.quarters[currentQuarterIndex].classes} 
                selectedItem={classItem ? classItem : ""}
                position={newPosition}
                doCrudOperation={props.doCrudOperation}

            />
        ];
}