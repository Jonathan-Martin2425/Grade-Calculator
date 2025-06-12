import Login from "./pages/login";
import { Route, useNavigate } from "react-router";
import { Routes } from "react-router";
import { Homepage } from "./pages/homepage";
import QuarterPage from "./pages/quarterPage";
import { useRef, useState } from "react";
import type { ListItemProps } from "./components/list";
import { ProtectedRoute } from "./ProtectedRoute";
import type { IApiSchoolData, Quarter, Grade } from "../../backend/src/common/ApiImageData";
import { ValidRoutes } from "../../shared/ValidRoutes.ts"


// interface below describe a position of data in the school heiarchy 
// down to a class's grade in the calcultor table

export interface SchoolPosition {
    school?: string,
    quarter?: string,
    class?: string,
    gradeIndex?: number,
}

export interface errorMessage{
    error: string,
    message: string,
}

function App() {
    const [schools, setSchools] = useState([] as IApiSchoolData[]);
    const [currentSchoolIndex, setCurrentSchoolIndex] = useState(0);
    const [isDarkMode, setIsDarkMode]= useState(false);
    const [token, setToken] = useState("");

    let ref = useRef(0);
    const navigate = useNavigate();

    function loginWithToken(token: string){
        setToken(token);
        updateGradeData(token);
        navigate("/homepage");
    }

    function logout(){
        setToken("");
        navigate("/");
    }

    async function updateGradeData(possibleToken: string = ""){
        let curToken = token;
        if(possibleToken) curToken = possibleToken;
        const response = await fetch("/api/schools", {
            headers: {
                "Authorization": `Bearer ${curToken}`
            }
        }); 
        ref.current = ref.current + 1;
        const curRef = ref.current;
        if(response.status >= 400){
            console.log("grade Data fetch error code") 
            //_setFetchHasErrored(true);
            return null;
        }

        const resJson = await response.json();
        if(resJson){
            if(curRef !== ref.current) {return null};
            const schools: IApiSchoolData[] = resJson as IApiSchoolData[];
            schools.sort((a, b) => a.name.localeCompare(b.name))
            if(schools) setSchools(schools);
        }else{
            //_setFetchHasErrored(true)
        }
    }

    async function doCrudOperation(
        position: SchoolPosition, 
        operation: string, 
        data1: ListItemProps | Grade, 
        data2?: IApiSchoolData | Quarter | ListItemProps | Grade,
    ): Promise<errorMessage | void>{

        let datatype = "school"
        if(position.school){
            datatype = "quarter";
            if(position.quarter){
                datatype = "class";
                if(position.class){
                    datatype = "grade";
                }
            }
        }

        let possibleError: errorMessage | void = undefined;
        // Excecutes given operation depending on the dataType found
        switch(operation){
            case "create":
                possibleError = await createNewItem(datatype, data1, position);
                break;
            case "delete":
                possibleError = await deleteItem(datatype, data1, position);
                break;
            case "update":

                //only case for grade is used, may implement other editing in the future
                if(data2){
                    possibleError = await updateItem(datatype, data1, data2, position);
                }else{
                    return {
                        error: "Internal Server Error",
                        message: `${datatype} wasn't updated becuase no new data was given`,
                    }
                }
                break;
        }

        const curSchoolCopy = schools.slice()[currentSchoolIndex];
        await updateGradeData();
        //makes sure current school stays selected after list is changed
        let newSchoolIndex: number = 0;
        for(let i in schools){
            if(schools[i].name === curSchoolCopy.name){
                newSchoolIndex = Number(i);
            }
        }
        setCurrentSchoolIndex(newSchoolIndex);

        if(possibleError) return possibleError;
    }

    async function createNewItem(itemType: string, data: ListItemProps | Grade, schoolPosition: SchoolPosition): Promise<void | errorMessage>{
        let body: string = JSON.stringify({});
        let fetchURL: string = "";
        if(itemType === "school"){
            body = JSON.stringify({
                name: (data as ListItemProps).name,
            });
            fetchURL = "/api/schools";
        }else if (itemType === "quarter"){
            body = JSON.stringify({
                name: (data as ListItemProps).name,
                school: schoolPosition.school,
            });
            fetchURL = "/api/quarters";

        }else if(itemType === "class"){
            body = JSON.stringify({
                name: (data as ListItemProps).name,
                school: schoolPosition.school,
                quarter: schoolPosition.quarter,
            });
            fetchURL = "/api/classes";

        }else if(itemType === "grade"){
            body = JSON.stringify({
                school: schoolPosition.school,
                quarter: schoolPosition.quarter,
                class: schoolPosition.class,
                catagory: (data as Grade).catagory,
                percentage: (data as Grade).percentage,
                grade: (data as Grade).grade,
            });
            fetchURL = "/api/grades";

        }

        const res = await fetch(fetchURL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: body,
        });
        if(res.status >= 400){
            return {
                error: "Internal Server Error",
                message: `${itemType} wasn't created`,
            }
        }
        return;
    }

    async function deleteItem(itemType: string, data: ListItemProps | Grade, schoolPosition: SchoolPosition){
        let body: string = JSON.stringify({});
        let fetchURL: string = "";
        if(itemType === "school"){
            body = JSON.stringify({
                name: (data as ListItemProps).name,
            });
            fetchURL = "/api/schools";
        }else if (itemType === "quarter"){
            body = JSON.stringify({
                name: (data as ListItemProps).name,
                school: schoolPosition.school,
            });
            fetchURL = "/api/quarters";

        }else if(itemType === "class"){
            body = JSON.stringify({
                name: (data as ListItemProps).name,
                school: schoolPosition.school,
                quarter: schoolPosition.quarter,
            });
            fetchURL = "/api/classes";

        }else if(itemType === "grade"){
            body = JSON.stringify({
                school: schoolPosition.school,
                quarter: schoolPosition.quarter,
                class: schoolPosition.class,
                gradeRow: {
                    catagory: (data as Grade).catagory,
                    percentage: (data as Grade).percentage,
                    grade: (data as Grade).grade,
                }
            });
            fetchURL = "/api/grades";

        }

        const res = await fetch(fetchURL, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: body,
        });
        if(res.status >= 400){
            return {
                error: "Internal Server Error",
                message: `${itemType} wasn't deleted`,
            }
        }
        return;
    }

    async function updateItem(itemType: string, oldData: ListItemProps | Grade, newData: ListItemProps | Grade, schoolPosition: SchoolPosition){
        let body: string = JSON.stringify({});
        let fetchURL: string = "";
        if(itemType === "school"){
            body = JSON.stringify({
                name: (oldData as ListItemProps).name,
                newName: (newData as ListItemProps).name,
            });
            fetchURL = "/api/schools";
        }else if (itemType === "quarter"){
            body = JSON.stringify({
                name: (oldData as ListItemProps).name,
                newName: (newData as ListItemProps).name,
                school: schoolPosition.school,
            });
            fetchURL = "/api/quarters";

        }else if(itemType === "class"){
            body = JSON.stringify({
                name: (oldData as ListItemProps).name,
                newName: (newData as ListItemProps).name,
                school: schoolPosition.school,
                quarter: schoolPosition.quarter,
            });
            fetchURL = "/api/classes";

        }else if(itemType === "grade"){
            body = JSON.stringify({
                school: schoolPosition.school,
                quarter: schoolPosition.quarter,
                class: schoolPosition.class,
                gradeRow: oldData as Grade,
                newGradeRow: newData as Grade,
            });
            fetchURL = "/api/grades";

        }

        const res = await fetch(fetchURL, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: body,
        });
        if(res.status >= 400){
            return {
                error: "Internal Server Error",
                message: `${itemType} wasn't deleted`,
            }
        }
        return;
    }  

    function TogleDarkMode(){
        setIsDarkMode(!isDarkMode);
    }


    let darkModeClass = "";
    if(isDarkMode){
        darkModeClass = "dark-mode";
    }


    // sets the current school for the quarter page depending on whether there is more than 1 school
    let curSchool: IApiSchoolData;
    if(schools.length < 1){
        curSchool = {
            name: "",
            quarters: [] as Quarter[],
        }
    }else{
        curSchool = schools[currentSchoolIndex];
    }

    return (
        <Routes>
            <Route path={ValidRoutes.LOGIN} element={<Login setToken={loginWithToken} isRegister={false}/>}/>
            <Route path={ValidRoutes.REGISTER} element={<Login setToken={loginWithToken} isRegister={true}/>}/>
            <Route path={ValidRoutes.HOME}
                element={
                <ProtectedRoute authToken={token}>
                    <Homepage 
                        setCurrentSchoolIndex={setCurrentSchoolIndex}
                        schools={schools}
                        doCrudOperation={doCrudOperation}
                        toggleDarkMode={TogleDarkMode}
                        logout={logout}
                        darkModeClass={darkModeClass}
                    />
                </ProtectedRoute>
            }/>
            <Route path={ValidRoutes.HOME_SCHOOL}
            element={
                <ProtectedRoute authToken={token}>
                    <Homepage 
                        schools={schools} 
                        setCurrentSchoolIndex={setCurrentSchoolIndex}
                        doCrudOperation={doCrudOperation}
                        toggleDarkMode={TogleDarkMode}
                        logout={logout}
                        darkModeClass={darkModeClass}
                    />
                </ProtectedRoute>
            }/>
            <Route path={ValidRoutes.QUARTER} element={
                <ProtectedRoute authToken={token}>
                    <QuarterPage 
                        toggleDarkMode={TogleDarkMode}
                        logout={logout}
                        darkModeClass={darkModeClass}
                        quarters={curSchool.quarters} 
                        position={{school: curSchool.name}}
                        doCrudOperation={doCrudOperation}
                    />
                </ProtectedRoute>
            }/>
            <Route path={ValidRoutes.QUARTER_SPECIFIED} element={
                <ProtectedRoute authToken={token}>
                    <QuarterPage 
                        toggleDarkMode={TogleDarkMode}
                        logout={logout}
                        darkModeClass={darkModeClass}
                        quarters={curSchool.quarters}
                        position={{school: curSchool.name}}
                        doCrudOperation={doCrudOperation}
                    />
                </ProtectedRoute>
            }/>
            <Route path={ValidRoutes.CLASS} element={
                <ProtectedRoute authToken={token}>
                    <QuarterPage 
                        toggleDarkMode={TogleDarkMode}
                        logout={logout}
                        darkModeClass={darkModeClass}
                        quarters={curSchool.quarters}
                        position={{school: curSchool.name}}
                        doCrudOperation={doCrudOperation}
                    />
                </ProtectedRoute>
            }/>
        </Routes>
    );
}

export default App;
