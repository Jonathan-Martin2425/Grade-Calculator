import { useState } from "react";
import type { Grade } from "../../../backend/src/common/ApiImageData";

interface ChangeGradRowProps {
    deleteRow: () => void,
    ChangeType: string,
    createRow?: (row: Grade) => void,
    editRow?: (newRow: Grade) => void,
    startRow?: Grade,
}

function ChangeGradRow(props: ChangeGradRowProps){
    let startGrade: Grade = {catagory: "", percentage: NaN, grade: "/"}
    if(props.startRow) {startGrade = props.startRow}
    const [grade, setGrade] = useState(startGrade);

    let changeType: () => void = () => console.log("changeType not assigned");
    if(props.ChangeType === "edit"){
        changeType = (() => {
            if(props.editRow){
                props.editRow(grade);
            }
        })
    }else if(props.ChangeType === "create"){
        changeType = (() => {
            if(props.createRow){
                props.createRow(grade);
            }
        })
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, inputType: string){
        const gradeCopy: Grade = Object.assign({}, grade);
        switch (inputType){
            case "catagory":
                gradeCopy.catagory = e.target.value;
                break;
            case "percentage":
                gradeCopy.percentage = Number(e.target.value);
                break;
            case "gradeNum":
                const gradeValue: string[] = gradeCopy.grade.split("/")
                gradeValue[0] = e.target.value;
                gradeCopy.grade = gradeValue.join("/");
                break;
            case "gradeDenom":
                const gradeValue2: string[] = gradeCopy.grade.split("/")
                gradeValue2[1] = e.target.value;
                gradeCopy.grade = gradeValue2.join("/");
                break;
        }
        setGrade(gradeCopy);
    }

    const formatedGrade: string[] = grade.grade.split("/");
    const formatedGradeNums: number[] = [];
    for(let i in formatedGrade){
        let num = Number(formatedGrade[i]);
        if(num <= 0){
            formatedGradeNums.push(NaN);
        }else{
            formatedGradeNums.push(num);
        }
    }

    return (
        <tr>
            <td><input 
                className={""} 
                type="text" 
                placeholder="Enter Here" 
                value={grade.catagory} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "catagory")}
                />
            </td>
            <td><input 
                className={""} 
                type="number" 
                placeholder="Enter Here" 
                value={grade.percentage.toString()} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "percentage")}
            />
            </td>
            <td>
                <input 
                className={""} 
                type="number" 
                placeholder="#" 
                value={Number(formatedGradeNums[0])} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "gradeNum")}
                />
                /
                <input 
                className={""} 
                type="number" 
                placeholder="#" 
                value={Number(formatedGradeNums[1])} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "gradeDenom")}
                />
            </td>
            <td>
                <input 
                type="button" 
                className="button list-item" 
                id={"create-input"} 
                value="+" 
                onClick={changeType}
                />
                <input 
                type="button" 
                className="button" 
                id={"create-input"} 
                value="-" 
                onClick={props.deleteRow}
                />
            </td>
        </tr>
    );
}

export default ChangeGradRow;