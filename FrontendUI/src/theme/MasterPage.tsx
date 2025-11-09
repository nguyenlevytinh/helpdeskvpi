import Typography from 'antd/es/typography';
import Card from 'antd/es/card';
import styled from 'styled-components';
import { useAppContext } from '../components/AppContext';

type Props = {
  children: React.ReactNode;
  title?: string; // nếu muốn override tiêu đề AppContext
};

const MasterPage = ({ children, title }: Props) => {
  const { state } = useAppContext();
  const pageTitle = title || state.pageTitle || '';

  return (
    <WrapperStl>
      {pageTitle && (
        <HeaderStl>
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              textTransform: 'uppercase',
              color: '#333',
            }}
          >
            {pageTitle}
          </Typography.Title>
        </HeaderStl>
      )}

      <Card
        style={{
          flex: 1,
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
        bodyStyle={{ padding: 16 }}
      >
        {children}
      </Card>
    </WrapperStl>
  );
};

export default MasterPage;

// ==== Styled Components ====
const WrapperStl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
`;

const HeaderStl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
