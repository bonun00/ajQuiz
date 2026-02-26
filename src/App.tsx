import {useState} from "react";
import QuizScreen from "./quizTalk.tsx";
import LoginScreen from "./LoginScreen.tsx";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    const handleLoginSuccess = (name: string) => {
        if (!name.trim()) return alert("이름을 입력해주세요!");
        setUserName(name);
        setIsLoggedIn(true);
    };

    return (
        <>
            {isLoggedIn ? (
                <QuizScreen />
            ) : (
                <LoginScreen onLogin={handleLoginSuccess} />
            )}
        </>
    );
}