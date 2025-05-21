interface HeaderProps {
    title: string,
    children: React.ReactNode,

}


function Header(props: HeaderProps){
    return (
        <header> {/*School Selector/adder is header*/}
            <h1>{props.title}</h1>
            <nav>
                {props.children} {/*Content of Header, back button for quarter page and quarters for homepage*/}
                <div className="header-container logout">
                    <div className="dark-mode-container">
                        <label htmlFor="dark-mode">Dark Mode</label>
                        <input type="checkbox" id="dark-mode"></input>
                    </div>
                    <form method="get" action="index.html">
                        <input type="submit" className="logout-button" value="Logout" formAction="index.html"/>
                    </form>
                </div>
            </nav> 
        </header>
    );
}

export default Header;