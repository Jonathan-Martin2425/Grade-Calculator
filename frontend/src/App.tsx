import Login from "./pages/login";
import { Route } from "react-router";
import { Routes } from "react-router";
import { Homepage } from "./pages/homepage";
import QuarterPage from "./pages/quarterPage";


const quarterList = [
    {name: "Fall 2024", linkTo: "Fall 2024"},
    {name: "Winter 2025", linkTo: "Winter 2025"},
    {name: "Spring 2025", linkTo: "Spring 2025"},
];

const classList = [
    {name: "CSC 437", linkTo: "class/CSC 437"},
    {name: "CSC 445", linkTo: "class/CSC 445"},
    {name: "MATH 241", linkTo: "class/MATH 241"},
];

const schools = [
    {name: "Cal Poly", linkTo: "Cal Poly"},
    {name: "My High School", linkTo: "My High School"},
];

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/homepage/:school" element={<Homepage schools={schools} quarters={quarterList}/>}/>
            <Route path="/homepage" element={<Homepage schools={schools} quarters={quarterList}/>}/>
            <Route path="/quarter" element={<QuarterPage classes={classList}/>}/>
            <Route path="/quarter/:quarter" element={<QuarterPage classes={classList}/>}/>
            <Route path="/quarter/:quarter/class/:classItem" element={<QuarterPage classes={classList}/>}/>
        </Routes>
    );
}

export default App;
