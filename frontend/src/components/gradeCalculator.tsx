//import { useState } from "react";

import { useState } from "react";
import type { SchoolPosition, School, Quarter, Grade } from "../App";
import type { ListItemProps } from "./list";
import NewGradRow from "./NewGradeRow";

interface CalculatorRow {
    catagory: string,
    percentage: number,
    grade: string,
}

interface CalculatorProps {
    rows: CalculatorRow[],
    isSingle?: boolean,
    doCrudOperation: (position: SchoolPosition, operation: string, data1: ListItemProps, data2?: School | Quarter | ListItemProps) => void,
}

function Calculator(props: CalculatorProps){
    const [isAddingGrade, setIsAddingGrade] = useState(false);
    const [calcRows, setCalcRows] = useState(props.rows);


    let createElement = (
        <tr>{/*New Row Row*/}
            <td/>
            <td><input type="button" className="button" id="create-class" value="+" onClick={startAddingGrade}/></td>
            <td/>
            <td/>
        </tr>
    );
    if(isAddingGrade){
        createElement = (<NewGradRow onClick={(row: Grade) => finishAddingGrade(row)}/>);
    }

    function addCalcRow(row: Grade){
        const clacRowsCopy = calcRows.slice();
        clacRowsCopy.push(row);
        setCalcRows(clacRowsCopy);
    
    }

    function startAddingGrade(){
        setIsAddingGrade(true);
    }

    function finishAddingGrade(row: Grade){
        const formatedGrade: string[] = row.grade.split("/");
        const formatedGradeNums: number[] = [];
        for(let i in formatedGrade){
            let num = Number(formatedGrade[i]);
            if(num <= 0){
                formatedGradeNums.push(NaN);
            }else{
                formatedGradeNums.push(num);
            }
        }

        if(row.catagory !== "" && row.grade !== "/" && !Number.isNaN(formatedGradeNums[0])  && !Number.isNaN(formatedGradeNums[1])){
            console.log("added");
            addCalcRow(row);
        }
        setIsAddingGrade(false);
    }


    //calculates total from calcRows
    let total = 0;
    for(let i in calcRows){
        const gradeAmmount: number[] = calcRows[i].grade.split("/").map((numString) => Number(numString))
        total += (calcRows[i].percentage/100) * (gradeAmmount[0]/gradeAmmount[1]);
    }

    return (
    <div className="column-container">
        <h2>Grade Calculator</h2>
        <table className="calculator-table">
            <tr className="head-row">
                <th>Catagory</th>
                <th>%</th>
                <th>Grades</th>
                <td/>
            </tr>

            {calcRows.map( (row: CalculatorRow) => {
                return (
                    <tr>
                        <td>{row.catagory}</td>
                        <td>{row.percentage}</td>
                        <td>{row.grade}</td>
                        <input type="button" className="button" id="create-class" value="Edit"/>
                    </tr>
                );
            })}

            {createElement}{/*New Row Row*/}

            <tr> {/*Total Row*/}
                <td>Total</td>
                <td></td>
                <td>{(total*100).toFixed(2) + "%"}</td>{/*create function to calculate total*/}
                <td/>
            </tr>
        </table>
    </div>
    );
}

export default Calculator;