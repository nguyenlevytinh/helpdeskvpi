import React, { useState } from "react";
import { Row, Col, Select, Input, DatePicker, Button, Space, Card } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export interface DashboardFilterValues {
  Department?: string;
  Category?: string;
  Email?: string;
  StartDate?: string;
  EndDate?: string;
}

interface Props {
  onSearch: (f: DashboardFilterValues) => void;
  onRefresh: () => void;
}

const DashboardFilters: React.FC<Props> = ({ onSearch, onRefresh }) => {
  const [formValues, setFormValues] = useState<DashboardFilterValues>({});

  const handleSearch = () => {
    const { Department, Category, Email, StartDate, EndDate } = formValues;
    onSearch({ Department, Category, Email, StartDate, EndDate });
    onRefresh();
  };

  return (
    <Card className="dashboard-filters">
      <Row gutter={12}>
        <Col span={6}>
          <Select
            placeholder="Phòng ban"
            allowClear
            onChange={(v) => setFormValues({ ...formValues, Department: v })}
            style={{ width: "100%", fontSize: 10 }}
            options={[
              { value: "IT Support", label: "IT Support" },
              { value: "Sales", label: "Sales" },
              { value: "HR", label: "HR" },
            ]}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Danh mục"
            allowClear
            onChange={(v) => setFormValues({ ...formValues, Category: v })}
            style={{ width: "100%", fontSize: 10 }}
            options={[
              { value: "Network", label: "Network" },
              { value: "Hardware", label: "Hardware" },
              { value: "Software", label: "Software" },
            ]}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Email"
            onChange={(e) =>
              setFormValues({ ...formValues, Email: e.target.value })
            }
            style={{ fontSize: 10 }}
          />
        </Col>
        <Col span={6}>
          <DatePicker.RangePicker
            onChange={(v) =>
              setFormValues({
                ...formValues,
                StartDate: v ? dayjs(v[0]).format("YYYY-MM-DD") : undefined,
                EndDate: v ? dayjs(v[1]).format("YYYY-MM-DD") : undefined,
              })
            }
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      <Space style={{ marginTop: 8 }}>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="small"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
        <Button icon={<ReloadOutlined />} size="small" onClick={onRefresh}>
          Làm mới
        </Button>
      </Space>
    </Card>
  );
};

export default DashboardFilters;
