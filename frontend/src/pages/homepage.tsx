import Header from "../components/header";
import List, { type ListItemProps } from "../components/list";
import MainContainer from "../components/mainContainer";
import { useParams } from "react-router";
import type { IApiSchoolData, Quarter, Course, Grade } from "../../../backend/src/common/ApiImageData";
import { type SchoolPosition } from "../App";

interface HomepageProps{
    toggleDarkMode: () => void,
    darkModeClass: string,
    schools: IApiSchoolData[],
    logout: () => void,
    setCurrentSchoolIndex: (i: number) => void,
    doCrudOperation: (position: SchoolPosition, operation: string, data1: ListItemProps | Grade, data2?: IApiSchoolData | Quarter | ListItemProps | Grade)=> void,
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

    let quarterGrades: number[];
    if(props.schools.length > 0){
        quarterGrades = props.schools[currentSchoolIndex].quarters.map((quarter: Quarter) => {
            if(quarter.classes.length <= 0) return -1;
            let classGrades: number[] = (quarter.classes as Course[]).map( 
                (c: Course) => {
                    if(c.gradeRows.length <= 0) return -1;
                    let total = 0;
                    for(let i in c.gradeRows){
                        const gradeAmmount: number[] = c.gradeRows[i].grade.split("/").map((numString) => Number(numString))
                        total += (c.gradeRows[i].percentage/100) * (gradeAmmount[0]/gradeAmmount[1]);
                    }

                    let res = 0;
                    if(total > 0.6){
                        res = 1.0;
                    }
                    if(total > 0.7){
                        res = 2.0;
                    }
                    if(total > 0.8){
                        res = 3.0;
                    }
                    if(total > 0.9){
                        res = 4.0;
                    }
                    return res;
                }
            )

            classGrades = classGrades.filter((grade: number) => grade != -1);
            if(classGrades.length < 1){
                return 0;
            }
            return classGrades.reduce((prev: number, cur: number) => prev + cur)/classGrades.length + 0;
        });   
    }else{
        quarterGrades = [];
    }


    quarterGrades = quarterGrades.filter((grade: number) => grade != -1);
    if(quarterGrades.length === 0) {quarterGrades = [0]}
    let CumulativeGPA: string = ((quarterGrades.reduce((prev: number, cur: number) => prev + cur))/quarterGrades.length + 0).toFixed(2);

    props.setCurrentSchoolIndex(currentSchoolIndex);
    let curSchool: IApiSchoolData;
    if(props.schools.length < 1){
        curSchool = {
            name: "",
            quarters: [] as Quarter[],
        }
    }else{
        curSchool = props.schools[currentSchoolIndex];
    }
    return (<div className={props.darkModeClass}>
                <Header title="Schools" darkModeClass={props.darkModeClass} toggleDarkMode={props.toggleDarkMode} logout={props.logout}>
                    <List 
                        title="Schools" 
                        linkTo={"/homepage/"} 
                        items={props.schools} 
                        isHeader={true} 
                        currentItem={curSchool.name}
                        position={{}}
                        doCrudOperation={props.doCrudOperation}
                    />
                </Header>,
                <MainContainer 
                    listName="Quarters" 
                    linkTo={"/quarter/"} 
                    list={curSchool.quarters}
                    doCrudOperation={props.doCrudOperation}
                    position={{school: curSchool.name}}
                    CumulativeGPA={CumulativeGPA}
                />
            </div>
        );
}