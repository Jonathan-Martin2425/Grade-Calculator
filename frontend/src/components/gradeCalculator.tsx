//import { useState } from "react";

import { useState } from "react";
import type { IApiSchoolData, Quarter, Grade } from "../../../backend/src/common/ApiImageData";
import type { SchoolPosition } from "../App";
import type { ListItemProps } from "./list";
import NewGradRow from "./NewGradeRow";

interface CalculatorProps {
    rows: Grade[],
    position: SchoolPosition,
    doCrudOperation: (position: SchoolPosition, operation: string, data1: ListItemProps | Grade, data2?: IApiSchoolData | Quarter | ListItemProps | Grade) => void,
    isEditingGrades: boolean[],
    setisEditingGrades: (isEditingGrades: boolean[]) => void
    isSingle?: boolean,
    selectedItem?: string,
}

function Calculator(props: CalculatorProps){
    const [isAddingGrade, setIsAddingGrade] = useState(false);
    const [isEditingGradesSingle, setisEditingGradesSingle] = useState([] as boolean[]);
    const [calcRows, setCalcRows] = useState(props.rows);

    let createElement = (
        <tr>{/*New Row Row*/}
            <td/>
            <td><input type="button" className="button" id="create-class" value="+" onClick={props.selectedItem || props.isSingle ? startAddingGrade : () => null}/></td>
            <td/>
            <td/>
        </tr>
    );  

    if(isAddingGrade){
        createElement = (
            <NewGradRow 
                deleteRow={() => setIsAddingGrade(false)} 
                ChangeType="create"
                createRow={(row: Grade) => finishAddingGrade(row)}
            />
        );
    }


    function addCalcRow(row: Grade){
        if(props.isSingle){
            const clacRowsCopy = calcRows.slice();
            clacRowsCopy.push(row);
            setCalcRows(clacRowsCopy);

            const editingListCopy = [...isEditingGradesSingle];
            editingListCopy.push(false);
            setisEditingGradesSingle(editingListCopy);
        }else{
            props.doCrudOperation(props.position, "create", row);
            const editingListCopy = [...props.isEditingGrades];
            editingListCopy.push(false);
            props.setisEditingGrades(editingListCopy);
        }
    }

    function deleteCalcRow(row: Grade, rowIndex: number){
        if(props.isSingle){
            let calcRowsCopy = calcRows.slice();
            calcRowsCopy = calcRowsCopy.filter(grade => grade !== row);
            setCalcRows(calcRowsCopy);

            const editingListCopy = [...isEditingGradesSingle];
            delete editingListCopy[rowIndex];
            setisEditingGradesSingle(editingListCopy);
        }else{
            props.doCrudOperation(props.position, "delete", row);

            const editingListCopy = [...props.isEditingGrades];
            delete editingListCopy[rowIndex];
            props.setisEditingGrades(editingListCopy);
        }
    }

    function startAddingGrade(){
        setIsAddingGrade(true);
    }

    function startEditingGrade(i: number){
        if(props.isSingle){
            const editingListCopy = [...isEditingGradesSingle];
            editingListCopy[i] = true;
            setisEditingGradesSingle(editingListCopy);
        }else{
            const editingListCopy = [...props.isEditingGrades];
            editingListCopy[i] = true;
            props.setisEditingGrades(editingListCopy);
        }
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

        if(row.catagory !== "" && !Number.isNaN(row.percentage) && row.grade !== "/" && !Number.isNaN(formatedGradeNums[0])  && !Number.isNaN(formatedGradeNums[1])){
            addCalcRow(row);
        }
        setIsAddingGrade(false);
    }

    function finishEditingGrade(oldRow: Grade, newRow: Grade, rowIndex: number){
        if(newRow.catagory && newRow.grade !== "/" && newRow.percentage){
           //const gradeRowPosition = Object.assign({gradeIndex: rowIndex} as SchoolPosition, props.position);
           props.doCrudOperation(props.position, "update", oldRow, newRow); 
        }

        //sets row's editing state to false at the given index
        const editingListCopy = [...props.isEditingGrades];
        editingListCopy[rowIndex] = false;
        props.setisEditingGrades(editingListCopy);
    }

    let curRows: Grade[] = props.rows;
    if(props.isSingle){
        curRows = calcRows;
    }

    //calculates total from calcRows
    let total = 0;
    for(let i in curRows){
        const gradeAmmount: number[] = curRows[i].grade.split("/").map((numString) => Number(numString))
        total += (curRows[i].percentage/100) * (gradeAmmount[0]/gradeAmmount[1]);
    }

    let isEditingArray = props.isEditingGrades;
    if(props.isSingle){
        isEditingArray = isEditingGradesSingle;
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

            {props.selectedItem || props.isSingle? 
                curRows.map( (row: Grade, rowIndex: number) =>  {
                    let editElement = (
                        <tr>
                            <td>{row.catagory}</td>
                            <td>{row.percentage}</td>
                            <td>{row.grade}</td>
                            <td>
                                <input 
                                    type="button" 
                                    className="button"
                                    id={"edit-" + row.catagory}
                                    value="Edit" 
                                    onClick={() => startEditingGrade(rowIndex)}
                                />
                            </td>
                        </tr>
                    )
                    if(isEditingArray[rowIndex]){
                        editElement = (<NewGradRow 
                                deleteRow={() => deleteCalcRow(row, rowIndex)}
                                ChangeType="edit"
                                editRow={(newRow: Grade) => finishEditingGrade(row, newRow, rowIndex)}
                                startRow={row}
                            />
                        );
                    }
                    return editElement;
                })
                :
                <tr >
                    <td>Please</td>
                    <td>Select</td>
                    <td>a Class/Course</td>
                </tr>
            }

            {createElement}{/*create New Row Row*/}

            <tr> {/*Total Row*/}
                <td>Total</td>
                <td></td>
                <td>{(total*100).toFixed(2) + "%"}</td>
                <td/>
            </tr>
        </table>
    </div>
    );
}

export default Calculator;