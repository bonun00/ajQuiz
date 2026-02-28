import {
    BottomCTA, Asset, List, ListRow, Spacing
} from '@toss/tds-mobile';
import logoImg from '../assets/aj.png';

interface LoginProps {
    onLogin: (name: string) => void;
    onShowRanking: () => void;
}

const LoginScreen = ({ onLogin,onShowRanking }: LoginProps) => {

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
                <Asset.Image
                    frameShape={{
                        height: 150, width: 250, // 가로로 긴 이미지에 맞춰 넓이 조절
                    }}
                    scaleType="crop"
                    src={logoImg}
                />
                <Spacing size={40} />

                <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
                    아재 개그 톡
                </h1>
                <p style={{ color: '#666', marginTop: '8px' }}>
                    아재 개그도 개그다.
                </p>
            </div>

            <Spacing size={48} />

            <List>
                <ListRow
                    left={<ListRow.AssetIcon name="icon-star-mono" />}
                    contents={
                        <ListRow.Texts
                            type="2RowTypeA"
                            top="채팅으로 푸는 아재 개그"
                            bottom="대화하며 정답을 맞춰 보세요."
                        />
                    }
                />
                <ListRow
                    left={<ListRow.AssetIcon name="icon-crown-fill" />}
                    contents={
                        <ListRow.Texts
                            type="2RowTypeA"
                            top="실시간 아재 랭킹"
                            bottom="전국 아재 서열에 도전하세요."
                        />
                    }
                />
            </List>

            <BottomCTA.Single
                onClick={() => onLogin('익명아재')}
                bottomAccessory={
                    <span
                        onClick={onShowRanking}
                        style={{ cursor: 'pointer', textDecoration: 'underline', color: '#6B7684' }}
                    >
            랭킹보기
          </span>
                }
            >
                퀴즈 시작하기
            </BottomCTA.Single>

        </div>
    )
};

export default LoginScreen;