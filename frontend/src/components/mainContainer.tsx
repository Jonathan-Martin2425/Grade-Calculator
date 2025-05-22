import List from "./list";
import Calculator from "./gradeCalculator";
import type { SchoolPosition } from "../App";

interface MainContainerProps {
    linkTo: string;
    listName: string,
    list: ListItemProps[],
    position: SchoolPosition,
    addNewItem: (data: ListItemProps, position: SchoolPosition) => void,
    selectedItem?: string
}

interface ListItemProps {
    name: string,
    onClick?: () => void,
}

interface CalculatorRow {
    catagory: string,
    percentage: number,
    grade: string,
}

const CalculatorRows: CalculatorRow[] = [
    {catagory: "HW", percentage: 15, grade: "10/20"},
    {catagory: "Exams", percentage: 45, grade: "80/100"},
    {catagory: "Projects", percentage: 40, grade: "50/60"},
];

function MainContainer(props: MainContainerProps){
    return (
        <main>
            <div className="column-container" id="left">
                <h2>Cumulative GPA</h2>
                <p className="list-item bigger">3.5</p>
                <h2>{props.listName}</h2>
                <List 
                    title={props.listName} 
                    linkTo={props.linkTo} 
                    items={props.list} 
                    currentItem={props.selectedItem} 
                    addNewItem={props.addNewItem}
                    position={props.position}
                    isHeader={false}
                />
            </div>
            <Calculator title="Single-Class Calculator" rows={CalculatorRows}/>
        </main>
    );
}

export default MainContainer;