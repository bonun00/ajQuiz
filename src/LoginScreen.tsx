import {
    Button, Asset, TextField, Spacing
} from '@toss/tds-mobile';
import { useState } from 'react';

interface LoginProps {
    onLogin: (name: string) => void;
}

// 컴포넌트 이름을 명시적으로 지정하여 디버깅과 관리를 용이하게 합니다.
const LoginScreen = ({ onLogin }: LoginProps) => {
    const [name, setName] = useState('');

    const handleStart = () => {
        if (!name.trim()) {
            alert('이름을 입력해주세요!');
            return;
        }
        onLogin(name);
    };


    return (
        <div style={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 24px',
            backgroundColor: '#fff'
        }}>
            <div style={{ textAlign: 'center' }}>
                {/* 봇 프로필이나 테마에 맞는 아이콘 */}
                <Asset.Icon name="bubble-fill" color="blue" size={60} />
                <Spacing size={24} />
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
                    넌센스 퀴즈 톡
                </h1>
                <p style={{ color: '#666', marginTop: '8px' }}>
                    채팅으로 즐기는 아재 개그 퀴즈
                </p>
            </div>

            <Spacing size={48} />

            <TextField
                variant="box"
                label="사용자 이름"
                placeholder="이름을 입력해주세요"
                onChange={(e) => setName(e.target.value)}
            />

            <Spacing size={16} />

            <Button
                size="large"
                onClick={handleStart}
                disabled={!name.trim()} // 이름 미입력 시 버튼 비활성화
            >
                퀴즈 시작하기
            </Button>
        </div>
    );
};

export default LoginScreen;