import { useAppContext } from '../components/AppContext';
import FeatureRoute from './FeatureRoute';
import styled from 'styled-components';
import { useThemeContext } from './ThemeProvider';
import { useEffect } from 'react';

const SidePad = () => {
  const { state } = useAppContext();
  const { setOpenSidePad } = useThemeContext();

  // Khi click vào menu -> nếu mobile thì tự đóng
  const handleClickMenu = () => {
    if (window.innerWidth < 992) setOpenSidePad(false);
  };

  useEffect(() => {
    // Optional: reset scroll top khi menu thay đổi
    document.querySelector('.ant-layout-sider')?.scrollTo(0, 0);
  }, [state.sideMenu]);

  return (
    <WrapperStl>
      {state.sideMenu.map((feature, i) => (
        <FeatureRoute
          key={i}
          feature={feature}
          onClick={handleClickMenu}
        />
      ))}
    </WrapperStl>
  );
};

export default SidePad;

// ==== Styled ====
const WrapperStl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  overflow-y: auto;
  height: calc(100vh - 60px);
`;
