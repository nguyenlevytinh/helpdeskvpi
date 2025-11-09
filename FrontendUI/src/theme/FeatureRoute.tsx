import { NavLink } from 'react-router-dom';
import Typography from 'antd/es/typography';
import styled from 'styled-components';
import colors from './colors';
import type { IFeature } from '../components/AppContext/type';

type Props = {
  feature: IFeature;
  onClick?: () => void;
};

const FeatureRoute = ({ feature, onClick }: Props) => {
  return (
    <NavLink
      to={feature.path}
      style={{ textDecoration: 'none' }}
      onClick={onClick}
    >
      {({ isActive }) => (
        <ItemStl $active={isActive}>
          {feature.icon && <IconWrapper>{feature.icon}</IconWrapper>}
          <Typography.Text
            style={{
              color: isActive ? colors.TEXT_WHITE : colors.TEXT_WHITE,
              fontWeight: isActive ? 600 : 400,
              flex: 1,
            }}
          >
            {feature.label}
          </Typography.Text>
        </ItemStl>
      )}
    </NavLink>
  );
};

export default FeatureRoute;

// ==== Styled Components ====
const ItemStl = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  gap: 10px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.2)' : 'transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;
