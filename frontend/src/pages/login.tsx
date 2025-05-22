/*interface LoginProps {
    switchPage: (e: React.MouseEvent<HTMLElement>) => void,
}*/

import { Link } from "react-router";

function Login(){
    return (
        <main className="login">
            <h1>Grade Calculator</h1>
            <div className="login-box">
                <p>Username</p>
                    <input type="text" className="login-input"/>
                <p>Password</p>
                <input type="password" className="login-input"/>
                <form method="get" className="login-enter" action="homepage.html">
                    <Link to="/homepage"><input type="button" className="login-enter" value="Enter"/></Link>
                </form>
            </div>
        </main>
    );
}

export default Login;