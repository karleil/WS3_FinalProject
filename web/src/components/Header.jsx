import { Link } from "react-router";

function Header({ handleLogout, isAuthenticated }) {
    return (
        <header className="bg-lime-900 text-white text-xl px-20 p-4 flex justify-between">  <Link to="/">Leil Final Project</Link>
            <div>
                {isAuthenticated ? <button onClick={handleLogout} className="hover:scale-[105%] border rounded-3xl px-3 text-sm hover:font-bold text-white p-1 cursor-pointer transition">Log Out</button> : <Link className="border bg-gray-800 p-1 hover:bg-green-500 text-white text-2xl hover:text-black rounded transition-colors mt-3" to="/sign-in">Log In</Link>}
            </div>
        </header>
    )
}
export default Header;