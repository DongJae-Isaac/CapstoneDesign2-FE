import { buttonStyles } from './Button.style';

const Button = ({ text, type, onClick, disabled }) => {
  //버튼 타입별로 스타일 결정
  const getButtonStyle = () => {
    switch (type) {
      case 'long':
        return buttonStyles.longBtn;
      default:
        return buttonStyles.login; // 기본값
    }
  };

  return (
    <button style={getButtonStyle()} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;