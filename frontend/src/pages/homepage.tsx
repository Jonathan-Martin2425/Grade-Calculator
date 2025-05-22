import Header from "../components/header";
import List, { type ListItemProps } from "../components/list";
import MainContainer from "../components/mainContainer";
import { useParams } from "react-router";
import { type School, type SchoolPosition } from "../App";

interface HomepageProps{
    schools: School[],
    setCurrentSchoolIndex: (i: number) => void,
    addNewItem: (data: ListItemProps, position: SchoolPosition) => void,
}

export function Homepage(props: HomepageProps){
    const {school} = useParams();

    // gets current school index from school name in school.name
    let currentSchoolIndex: number = 0;
    for(let i in props.schools){
        if(props.schools[i].name === school){
            currentSchoolIndex = Number(i);
        }
    }

    props.setCurrentSchoolIndex(currentSchoolIndex);
    return [
            <Header title="Schools">
                <List 
                    title="Schools" 
                    linkTo={"/homepage/"} 
                    items={props.schools} 
                    isHeader={true} 
                    currentItem={props.schools[currentSchoolIndex].name}
                    position={{}}
                    addNewItem={props.addNewItem}
                />
            </Header>,
            <MainContainer 
                listName="Quarters" 
                linkTo={"/quarter/"} 
                list={props.schools[currentSchoolIndex].quarters}
                addNewItem={props.addNewItem}
                position={{school: props.schools[currentSchoolIndex].name}}
            />
        ]
}