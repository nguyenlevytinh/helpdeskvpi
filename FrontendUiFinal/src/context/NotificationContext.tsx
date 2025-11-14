import React, { createContext, useContext } from "react";
import { message } from "antd";

type NotifyType = "success" | "error" | "info" | "warning";

interface NotificationContextType {
  notify: (type: NotifyType, content: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const notify = (type: NotifyType, content: string) => {
    messageApi.open({
      type,
      content,
      duration: 2,
    });
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {contextHolder}   {/* MUST HAVE or message không bao giờ hiển thị */}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);
