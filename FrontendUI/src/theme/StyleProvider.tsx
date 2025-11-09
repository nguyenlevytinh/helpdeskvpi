import type { FC, PropsWithChildren } from 'react';
import ConfigProvider from 'antd/es/config-provider';
import colors from './colors';

const StyleProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.FILL,
          colorBgBase: colors.BG,
          colorTextBase: colors.TEXT,
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default StyleProvider;
