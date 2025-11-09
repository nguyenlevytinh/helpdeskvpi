import { Spin } from 'antd';
import Typography from 'antd/es/typography';
import { useAppContext } from './AppProvider';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const AppLoader = () => {
  const { state } = useAppContext();
  const { loading, status } = state;

  if (!loading) return null; // chỉ hiển thị khi loading = true

  return (
    <LoaderWrapper>
      <div style={{ textAlign: 'center' }}>
        <Spin size="large" />
        <Typography.Text
          style={{ display: 'block', marginTop: 12 }}
          strong
        >
          {status || 'Đang xử lý, vui lòng đợi...'}
        </Typography.Text>
      </div>
    </LoaderWrapper>
  );
};

export default AppLoader;
