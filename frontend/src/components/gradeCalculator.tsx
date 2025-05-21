//import { useState } from "react";

interface CalculatorRow {
    catagory: string,
    percentage: number,
    grade: string,
}

interface CalculatorProps {
    title: string,
    rows: CalculatorRow[],
}

function Calculator(props: CalculatorProps){
    return (
    <div className="column-container">
        <h2>{props.title}</h2>
        <table className="calculator-table">
            <tr className="head-row">
                <th>Catagory</th>
                <th>%</th>
                <th>Grades</th>
                <td/>
            </tr>

            {props.rows.map( (row: CalculatorRow) => {
                return (
                    <tr>
                        <td>{row.catagory}</td>
                        <td>{row.percentage}</td>
                        <td>{row.grade}</td>
                        <input type="button" className="button" id="create-class" value="Edit"/>
                    </tr>
                );
            })}

            <tr>{/*New Row Row*/}
                <td/>
                <td><input type="button" className="button" id="create-class" value="+"/></td>
                <td/>
                <td/>
            </tr>

            <tr> {/*Total Row*/}
                <td>Total</td>
                <td></td>
                <td>0.7683</td>{/*create function to calculate total*/}
                <td/>
            </tr>
        </table>
    </div>
    );
}

export default Calculator;