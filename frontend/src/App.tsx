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
    classes: Course[],
}
export interface Course{
    name: string,
    gradeRows: Grade[],
}

export interface Grade {
    catagory: string,
    percentage: number,
    grade: string,
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
    class?: string,
    gradeIndex?: number,
}

const SCHOOLS: School[] = [
    {
        name: "Cal Poly", 
        quarters: [
            {
                name: "Fall 2024", 
                classes: [
                    {
                        name: "CSC 437", 
                        gradeRows: [
                                    {catagory: "HW", percentage: 15, grade: "10/20"},
                                    {catagory: "Exams", percentage: 45, grade: "80/100"},
                                    {catagory: "Projects", percentage: 40, grade: "50/60"},
                                ]
                    },
                    {name: "CSC 445", gradeRows: []},
                    {name: "MATH 241", gradeRows: []},
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
    const [isDarkMode, setIsDarkMode]= useState(false);

    function doCrudOperation(
        position: SchoolPosition, 
        operation: string, 
        data1: ListItemProps | Grade, 
        data2?: School | Quarter | ListItemProps | Grade,
    ){
        let schoolsCopy = schools.slice();


        // Gets indexes and dataType from the given position variable
        const indexes = {
            schoolIndex: 0,
            quarterIndex: 0,
            classIndex: 0,
            gradeIndex: 0,
            dataType: "school",
        };

        if(position.school){
            // gets index of school given position.school
            let schoolIndex = 0;
            for(let i in schoolsCopy){
                if(schoolsCopy[i].name === position.school){
                    schoolIndex = Number(i);
                }
            }

            indexes.schoolIndex = schoolIndex;
            // if position contains school and quarter name, changes classes
            if(position.quarter){
                // gets index of quarter given position.quarter
                let quarterIndex = 0;
                for(let j in schoolsCopy[schoolIndex].quarters){
                    if(schoolsCopy[schoolIndex].quarters[j].name === position.quarter){
                        quarterIndex = Number(j);
                    }
                }
                indexes.quarterIndex = quarterIndex;

                if(position.class){
                    let classIndex = 0;
                    for(let k in schoolsCopy[schoolIndex].quarters){
                        if(schoolsCopy[schoolIndex].quarters[quarterIndex].classes[k].name === position.class){
                            classIndex = Number(k);
                        }
                    }
                    indexes.classIndex = classIndex;
                    indexes.dataType = "grade"; 
                }else{
                    indexes.dataType = "class"; 
                }              
            }else{
                // if position contains school name, changes quarters
                indexes.dataType = "quarter";
            }
        }// if position is empty, changes schools


        // Excecutes given operation depending on the dataType found
        switch(operation){
            case "create":
                switch(indexes.dataType){
                    case "school":
                        const newItem = createNewItem("school", data1 as ListItemProps) as School;
                        schoolsCopy.push(newItem);
                        break;
                    case "quarter":
                        const newItem2 = createNewItem("quarter", data1 as ListItemProps) as Quarter;
                        schoolsCopy[indexes.schoolIndex].quarters.push(newItem2);
                        break;
                    case "class":
                        const newItem3 = createNewItem("class", data1 as ListItemProps) as Course;
                        schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes.push(newItem3);
                        break;
                    case "grade":
                        const newItem4 = createNewItem("grade", data1 as Grade) as Grade;
                        schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes[indexes.classIndex].gradeRows.push(newItem4);
                        break;
                } 
                break;
            case "delete":
                switch(indexes.dataType){
                    case "school":
                        let data1Typecast: ListItemProps = data1 as ListItemProps;
                        schoolsCopy = schoolsCopy.filter(c => c.name !== data1Typecast.name);

                        //makes sure current school stays selected after list is changed
                        let currentSchoolIndex: number = 0;
                        for(let i in schoolsCopy){
                            if(schoolsCopy[i].name === data1Typecast.name){
                                currentSchoolIndex = Number(i);
                            }
                        }
                        setCurrentSchoolIndex(currentSchoolIndex);

                        break;
                    case "quarter":
                        let data1Typecast2: ListItemProps = data1 as ListItemProps;
                        schoolsCopy[indexes.schoolIndex].quarters = schoolsCopy[indexes.schoolIndex].quarters.filter(c => c.name !== data1Typecast2.name);
                        break;
                    case "class":
                        let data1Typecast3: ListItemProps = data1 as ListItemProps;
                        schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes = 
                        schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes.filter(c => c.name !== data1Typecast3.name);
                        break;
                    case "grade":
                        let data1Typecast4: Grade = data1 as Grade;
                        schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes[indexes.classIndex].gradeRows = 
                        schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes[indexes.classIndex].gradeRows.filter(c => c !== data1Typecast4);
                        break;
                } 
                break;
            case "update":

                //only case for grade is used, may implement other editing in the future
                switch(indexes.dataType){
                    case "school":
                        if(!data2) return
                        const data2Ref: School = data2 as School;
                        const dataRef = schoolsCopy.find(c => c.name === (data1 as ListItemProps).name);
                        if(!dataRef) return // makes sure data found using .find isn't null
                        dataRef.name = (data2 as School).name;
                        dataRef.quarters = data2Ref.quarters;
                        break;
                    case "quarter":
                        if(!data2) return
                        const data2Ref2: Quarter = data2 as Quarter;
                        const dataRef2 = schoolsCopy[indexes.schoolIndex].quarters.find(c => c.name === (data1 as ListItemProps).name);
                        if(!dataRef2) return // makes sure data found using .find isn't null
                        dataRef2.name = (data2 as Quarter).name;
                        dataRef2.classes = data2Ref2.classes;
                        break;
                    case "class":
                       if(!data2) return
                        const dataRef3 = schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes.find(c => c.name === (data1 as ListItemProps).name);
                        if(!dataRef3) return // makes sure data found using .find isn't null
                        dataRef3.name = (data2 as Course).name;
                        break;
                    case "grade":
                        if(!data2) return
                        let dataRef4 = schoolsCopy[indexes.schoolIndex].quarters[indexes.quarterIndex].classes[indexes.classIndex]
                        .gradeRows.find(c => c === (data1 as Grade));
                        if(!dataRef4) return // makes sure data found using .find isn't null
                        dataRef4.catagory = (data2 as Grade).catagory;
                        dataRef4.grade = (data2 as Grade).grade;
                        dataRef4.percentage = (data2 as Grade).percentage;
                        break;
                } 
                break;
        }

        setSchools(schoolsCopy);
    }

    function createNewItem(itemType: string, data: ListItemProps | Grade){
        if(itemType === "school"){
            const item: School = {
                name: (data as ListItemProps).name,
                quarters: new Array<Quarter>(),
            }
            return item
        }else if (itemType === "quarter"){
            const item: Quarter = {
                name: (data as ListItemProps).name,
                classes: new Array<Course>(),
            }
            return item
        }else if(itemType === "class"){
            const item: Course = {
                name: (data as ListItemProps).name,
                gradeRows: new Array<Grade>(),
            }
            return item
        }else if(itemType === "grade"){
            return data as Grade;
        }
    }

    function TogleDarkMode(){
        setIsDarkMode(!isDarkMode);
    }


    let darkModeClass = "";
    if(isDarkMode){
        darkModeClass = "dark-mode";
    }
    
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/homepage/:school" 
            element={<Homepage 
                    schools={schools} 
                    setCurrentSchoolIndex={setCurrentSchoolIndex}
                    doCrudOperation={doCrudOperation}
                    toggleDarkMode={TogleDarkMode}
                    darkModeClass={darkModeClass}
                />
            }/>
            <Route path="/homepage" 
                element={<Homepage 
                    setCurrentSchoolIndex={setCurrentSchoolIndex}
                    schools={schools}
                    doCrudOperation={doCrudOperation}
                    toggleDarkMode={TogleDarkMode}
                    darkModeClass={darkModeClass}
                />
            }/>
            <Route path="/quarter" element={
                <QuarterPage 
                    toggleDarkMode={TogleDarkMode}
                    darkModeClass={darkModeClass}
                    quarters={schools[currentSchoolIndex].quarters} 
                    position={{school: schools[currentSchoolIndex].name}}
                    doCrudOperation={doCrudOperation}
                />
            }/>
            <Route path="/quarter/:quarter" element={
                <QuarterPage 
                    toggleDarkMode={TogleDarkMode}
                    darkModeClass={darkModeClass}
                    quarters={schools[currentSchoolIndex].quarters}
                    position={{school: schools[currentSchoolIndex].name}}
                    doCrudOperation={doCrudOperation}
                />
            }/>
            <Route path="/quarter/:quarter/class/:classItem" element={
                <QuarterPage 
                    toggleDarkMode={TogleDarkMode}
                    darkModeClass={darkModeClass}
                    quarters={schools[currentSchoolIndex].quarters}
                    position={{school: schools[currentSchoolIndex].name}}
                    doCrudOperation={doCrudOperation}
                />
            }/>
        </Routes>
    );
}

export default App;
