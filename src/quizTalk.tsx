import {
    TextArea,
    Bubble,
    Button, Top, Asset, IconButton
} from '@toss/tds-mobile';
import { useState, useEffect, useRef } from 'react';
import { db } from './firebaseCongfig.tsx';
import { collection, getDocs } from 'firebase/firestore';


interface Message {
    role: 'bot' | 'user';
    text: string;
}


type Joke = {
    question: string;
    answer: string;
};

function QuizScreen () {
    const [index, setIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    // 맞춘 개그 리스트 상태 추가
    const [solvedList, setSolvedList] = useState<Joke[]>([]);
    const [jokes, setJokes] = useState<Joke[]>([])
    // 메뉴 열림/닫힘 상태
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: '안녕! 넌센스 퀴즈 마스터에 도전해봐!' },
    ]);
    const [isWaiting, setIsWaiting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
        const fetchJokes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "jokes"));
                const fetchedJokes = querySnapshot.docs.map(doc => doc.data() as Joke);

                if (fetchedJokes.length > 0) {
                    setJokes(fetchedJokes);
                    setMessages([
                        { role: 'bot', text: fetchedJokes[0].question }
                    ]);
                }
            } catch (error) {
                setMessages([{ role: 'bot', text: '데이터를 불러오지 못했습니다.' }]);
            }
        };
        fetchJokes();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSend = () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isWaiting) return;

        const currentJoke = jokes[index];
        const isCorrect = trimmedInput.includes(currentJoke.answer);

        if (isCorrect) {
            const newScore=score+1;
            setScore(newScore);
        }
        if (!solvedList.some(joke => joke.question === currentJoke.question)) {
            setSolvedList(prev => [...prev, currentJoke]);
        }



        setMessages((prev) => [
            ...prev,
            { role: 'user', text: trimmedInput },
            { role: 'bot', text: isCorrect ? `정답이야! (+10점) 🎉` : `땡! 정답은 [${currentJoke.answer}]였어. 😂` }
        ]);

        setInputValue('');
        setIsWaiting(true);

        setTimeout(() => {
            const nextIndex = (index + 1) % jokes.length;
            setIndex(nextIndex);
            setMessages((prev) => [...prev, { role: 'bot', text: jokes[nextIndex].question }]);
            setIsWaiting(false);
        }, 2000);
    };

    return (
        <div style={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            position: 'relative',
            overflow: 'hidden'
        }}>

            <div style={{
                position: 'absolute',
                top: 0,
                right: isMenuOpen ? 0 : '-100%',
                width: '80%', // 조금 더 넓게 조정
                height: '100%',
                backgroundColor: '#f9fafb',
                boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                transition: 'right 0.3s ease',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 24}}>
                    <h3 style={{margin: 0}}>수집한 개그 앨범</h3>
                    <button onClick={() => setIsMenuOpen(false)}
                            style={{border: 'none', background: 'none', fontSize: '20px'}}>✕
                    </button>
                </div>

                <div style={{flex: 1, overflowY: 'auto'}}>
                    {solvedList.length === 0 ? (
                        <p style={{color: '#888', textAlign: 'center', marginTop: 40}}>아직 수집한 개그가 없어요!</p>
                    ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                            {solvedList.map((item, i) => (
                                <div key={i} style={{
                                    padding: '16px',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #eee'
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#3182f6',
                                        marginBottom: 4,
                                        fontWeight: 'bold'
                                    }}>Q.
                                    </div>
                                    <div
                                        style={{fontSize: '14px', color: '#333', marginBottom: 8}}>{item.question}</div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#ff4b4b',
                                        marginBottom: 4,
                                        fontWeight: 'bold'
                                    }}>A.
                                    </div>
                                    <div
                                        style={{fontSize: '15px', color: '#000', fontWeight: '600'}}>{item.answer}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 📊 상단 상태바 */}
            <Top upperGap={0} lowerGap={0}
                 title={<Top.TitleParagraph size={22}><Asset.Icon color="blue" name="star-line"/> 맞힌 갯수 : {score} </Top.TitleParagraph>}
                 right={  <IconButton
                     src="https://static.toss.im/icons/svg/icon-line-three-mono.svg"
                     variant="clear"
                     aria-label="햄버거 메뉴 열기"
                     onClick={()=>setIsMenuOpen(true)}
                 />}
            />
            {/* 💬 채팅 영역 */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'column-reverse',
                gap: 12
            }}>
                <div ref={scrollRef} style={{height: '20px', flexShrink: 0}}/>
                {[...messages].reverse().map((msg, i) => (
                    <div key={i}
                         style={{display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'}}>
                        <Bubble background={msg.role === 'user' ? 'blue' : 'grey'} withTail>
                            {msg.text}
                        </Bubble>
                    </div>
                ))}
            </div>

            {/* ⌨️ 하단 입력바 */}
            <div style={{
                padding: '12px 16px env(safe-area-inset-bottom)',
                backgroundColor: '#fff',
                borderTop: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: 8
            }}>
                <div style={{flex: 1}}>
                    <TextArea
                        variant="box"
                        rows={1}
                        placeholder={jokes.length === 0? "로딩중" : (isWaiting ? "대답 기다리는 중..." : "정답 입력...")}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isWaiting}
                        onClick={handleSend||jokes.length === 0}
                    />
                </div>
                <Button size="small" onClick={handleSend} disabled={!inputValue.trim() || isWaiting}>
                    전송
                </Button>
            </div>
        </div>
    );
}

export default QuizScreen;