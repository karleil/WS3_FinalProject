import { useState } from 'react';
import { useNavigate } from "react-router";

function SignIn({ handleLogin}) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch("http://localhost:3000/users/sign-in", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then( response => response.json() )
        .then( returnedData => {

            localStorage.setItem( "jwt-token", returnedData.jwt);

     
            handleLogin();
        });
    }
    return (
        <div className="fixed inset-0 bg-[rgba(255,255,255,0.9)] flex justify-center items-center left-0 top-0 z-50;">
            <div className="border shadow-2xl bg-gray-200 max-w-[600px] max-h-[90vh] overflow-y-auto w-full relative p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='Email'
                            required
                            onChange={(event) => {
                                setFormData({ ...formData, email: event.target.value });
                            }}
                        />
                    </div>
                    <div >
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder='Password'
                            name="password"
                            required
                            onChange={(event) => {
                                setFormData({ ...formData, password: event.target.value });
                            }}
                        />
                    </div>

                    <input type="submit" value="Sign In" className="border bg-gray-800 p-1 hover:bg-green-500 text-white text-2xl hover:text-black rounded transition-colors mt-3" />
                </form>

            </div>
        </div>
    )
}
export default SignIn;