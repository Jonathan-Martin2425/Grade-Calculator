import Login from "./pages/login";
import { Route } from "react-router";
import { Routes } from "react-router";
import { Homepage } from "./pages/homepage";
import QuarterPage from "./pages/quarterPage";
import { useState } from "react";
import type { ListItemProps } from "./components/list";

export interface School {
    name: string,
    quarters: Quarter[]
}

export interface Quarter {
    name: string,
    classes: ListItemProps[],
}


// both interfaces below describe a position of data in the school heiarchy 
// down to a class's grade in the calcultor table
/*interface Grade {
    catagory: string,
    percent: number,
    grade: string,
}*/

export interface SchoolPosition {
    school?: string,
    quarter?: string,
}

const SCHOOLS: School[] = [
    {
        name: "Cal Poly", 
        quarters: [
            {
                name: "Fall 2024", 
                classes: [
                    {name: "CSC 437"},
                    {name: "CSC 445"},
                    {name: "MATH 241"},
                ]
            },
            {name: "Winter 2025", classes: []},
            {name: "Spring 2025", classes: []},
        ]},
    {
        name: "My High School",
        quarters: [
            {name: "Fall 2021", classes: []},
            {name: "Spring 2022", classes: []},
        ],
    },
];

function App() {
    const [schools, setSchools] = useState(SCHOOLS);
    const [currentSchoolIndex, setCurrentSchoolIndex] = useState(0);

    function addNewItem(data: ListItemProps, position: SchoolPosition){
        const schoolsCopy = schools.slice();

        if(position.school){
            // gets index of school given position.school
            let schoolIndex = 0;
            for(let i in schoolsCopy){
                if(schoolsCopy[i].name === position.school){
                    schoolIndex = Number(i);
                }
            }

            // if newItem is a class
            if(position.quarter){
                // gets index of quarter given position.quarter
                let quarterIndex = 0;
                for(let j in schoolsCopy[schoolIndex].quarters){
                    if(schoolsCopy[schoolIndex].quarters[j].name === position.quarter){
                        quarterIndex = Number(j);
                    }
                }
                const newItem = createNewItem("class", data) as ListItemProps;
                schoolsCopy[schoolIndex].quarters[quarterIndex].classes.push(newItem);

            }else{  // if newItem is a quarter
                const newItem = createNewItem("quarter", data) as Quarter;
                console.log(newItem);
                schoolsCopy[schoolIndex].quarters.push(newItem);
            }

        }else{// if newItem is a school
            const newItem = createNewItem("school", data) as School;
            schoolsCopy.push(newItem);
        }

        setSchools(schoolsCopy);
    }

    function createNewItem(itemType: string, data: ListItemProps){
        if(itemType === "school"){
            const item: School = {
                name: data.name,
                quarters: new Array<Quarter>(),
            }
            return item
        }else if (itemType === "quarter"){
            const item: Quarter = {
                name: data.name,
                classes: new Array<ListItemProps>(),
            }
            return item
        }else if(itemType === "class"){
            return data
        }
    }

    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/homepage/:school" 
            element={<Homepage 
                    schools={schools} 
                    setCurrentSchoolIndex={setCurrentSchoolIndex}
                    addNewItem={addNewItem}
                />
            }/>
            <Route path="/homepage" 
                element={<Homepage 
                    setCurrentSchoolIndex={setCurrentSchoolIndex}
                    schools={schools}
                    addNewItem={addNewItem}
                />
            }/>
            <Route path="/quarter" element={
                <QuarterPage 
                    quarters={schools[currentSchoolIndex].quarters} 
                    position={{school: schools[currentSchoolIndex].name}}
                    addNewItem={addNewItem}
                />
            }/>
            <Route path="/quarter/:quarter" element={
                <QuarterPage 
                    quarters={schools[currentSchoolIndex].quarters}
                    position={{school: schools[currentSchoolIndex].name}}
                    addNewItem={addNewItem}
                />
            }/>
            <Route path="/quarter/:quarter/class/:classItem" element={
                <QuarterPage 
                    quarters={schools[currentSchoolIndex].quarters}
                    position={{school: schools[currentSchoolIndex].name}}
                    addNewItem={addNewItem}
                />
            }/>
        </Routes>
    );
}

export default App;
