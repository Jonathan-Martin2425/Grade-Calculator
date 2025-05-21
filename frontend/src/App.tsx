import Login from "./components/login";
import Header from "./components/header";
import MainContainer from "./components/mainContainer";
import List from "./components/list";
import { useState } from "react";


const quarterList = [
    {name: "Fall 2024"},
    {name: "Winter 2025"},
    {name: "Spring 2025"},
];

const classList = [
    {name: "CSC 437"},
    {name: "CSC 445"},
    {name: "MATH 241"},
];

const schools = [
    {name: "Cal poly"},
    {name: "My High School"},
];
function App() {
    const [page, setPage] = useState("login");

    function switchPage(page: string){
        setPage(page);
    }

    const pages: {
    login: React.ReactNode[], 
    homepage: React.ReactNode[], 
    quarter: React.ReactNode[], 
    } = {
        login: [<Login switchPage={() => switchPage("homepage")}/>],
        homepage: [
            <Header title="Schools">
                <List title="Schools" items={schools} isHeader={true}/>
            </Header>,
            <MainContainer list={quarterList} listName="Quarters"/>
        ],
        quarter: [
            <Header title="Fall Quarter 2025">
                <div className="header-container">
                    <a href="homepage.html" className="bigger">Back</a>
                </div>
            </Header>,
            <MainContainer list={classList} listName="Classes"/>
        ],
    }

    if(page === "login" || page === "homepage" || page === "quarter"){
        return pages[page];
    }
}

export default App;
