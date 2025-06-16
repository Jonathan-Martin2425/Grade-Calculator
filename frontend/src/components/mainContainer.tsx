import List from "./list";
import Calculator from "./gradeCalculator";
import type { IApiSchoolData, Quarter, Course, Grade } from "../../../backend/src/common/ApiImageData";
import type { SchoolPosition } from "../App";
import { useState } from "react";

interface MainContainerProps {
    linkTo: string;
    listName: string,
    list: ListItemProps[] | Course[],
    position: SchoolPosition,
    doCrudOperation: (position: SchoolPosition, operation: string, data1: ListItemProps | Grade, data2?: IApiSchoolData | Quarter | ListItemProps | Grade) => void,
    selectedItem?: string,
    CumulativeGPA?: string,
}

interface ListItemProps {
    name: string,
    onClick?: () => void,
}

function MainContainer(props: MainContainerProps){
    
    let isSingle = true;
    let calcPosition: SchoolPosition = {};
    let gradeRows: Grade[] | undefined = [];
    let [isEditingGrades, setisEditingGrades] = [[] as boolean[], (_e: boolean[]) => console.log("not setting isEditingGrades")]
    if(props.listName === "Classes"){
        isSingle = false;
        calcPosition = Object.assign({class: props.selectedItem} as SchoolPosition, props.position);
        gradeRows = (props.list as Course[]).find(c => c.name === props.selectedItem)?.gradeRows;
        if(gradeRows) [isEditingGrades, setisEditingGrades] = useState(gradeRows?.map(() => false));
        if(!gradeRows) {gradeRows = [] as Grade[]};
    }

    function findGPA(){
        let classGrades: number[] = (props.list as Course[]).map( 
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
        if(classGrades.length === 0) classGrades = [0]
        return classGrades.reduce((prev: number, cur: number) => prev + cur)/classGrades.length + 0;
    }

    function resetIsEditingGrades(){
        const isEditingGradesCopy = isEditingGrades.slice();
        for(let i in isEditingGradesCopy){
            isEditingGradesCopy[i] = false;
        }
        setisEditingGrades(isEditingGradesCopy);
    }

    let leftList = props.list.slice() as ListItemProps[];
    leftList = leftList.filter((quarter) => quarter.name);
    return (
        <main>
            <div className="column-container" id="left">
                <h2>Cumulative GPA</h2>
                <p className="list-item bigger">{props.CumulativeGPA ? props.CumulativeGPA : findGPA().toFixed(2)}</p>
                <h2>{props.listName}</h2>
                <List 
                    title={props.listName} 
                    linkTo={props.linkTo} 
                    items={leftList as ListItemProps[]} 
                    currentItem={props.selectedItem} 
                    doCrudOperation={props.doCrudOperation}
                    position={props.position}
                    isHeader={false}
                    resetEditing={resetIsEditingGrades}
                />
            </div>
            <Calculator 
                rows={gradeRows} 
                position={calcPosition} 
                isSingle={isSingle} 
                doCrudOperation={props.doCrudOperation} 
                selectedItem={props.selectedItem}
                isEditingGrades={isEditingGrades}
                setisEditingGrades={setisEditingGrades}
            />
        </main>
    );
}

export default MainContainer;