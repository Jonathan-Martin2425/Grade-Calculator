import { Link } from "react-router";

interface HeaderProps {
    title: string,
    children: React.ReactNode,
    toggleDarkMode: () => void,
    darkModeClass: string,
}


function Header(props: HeaderProps){

    let isDarkMode = false;
    if(props.darkModeClass === "dark-mode"){
        isDarkMode = true;
    }
    return (
        <header> {/*School Selector/adder is header*/}
            <h1>{props.title}</h1>
            <nav>
                {props.children} {/*Content of Header, back button for quarter page and quarters for homepage*/}
                <div className="header-container logout">
                    <div className="dark-mode-container">
                        <label htmlFor="dark-mode">Dark Mode</label>
                        <input type="checkbox" id="dark-mode" checked={isDarkMode} onClick={props.toggleDarkMode}></input>
                    </div>
                    <form method="get" action="index.html">
                        <Link to="/"><input type="submit" className="logout-button" value="Logout" formAction="index.html"/></Link>
                    </form>
                </div>
            </nav> 
        </header>
    );
}

export default Header;