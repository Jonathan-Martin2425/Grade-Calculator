import Header from "../components/header";
import List from "../components/list";
import MainContainer from "../components/mainContainer";
import {type ListItemProps} from "../components/list";
import { useParams } from "react-router";

interface HomepageProps{
    schools: ListItemProps[],
    quarters: ListItemProps[],
}

export function Homepage(props: HomepageProps){
    const {school} = useParams();

    return [
            <Header title="Schools">
                <List 
                    title="Schools" 
                    linkTo={"/homepage/"} 
                    items={props.schools} 
                    isHeader={true} 
                    currentItem={school}
                />
            </Header>,
            <MainContainer listName="Quarters" linkTo={"/quarter/"} list={props.quarters}/>
        ]
}