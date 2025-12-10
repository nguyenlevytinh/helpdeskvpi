import React, { useState } from "react";
import { Row, Col, Select, DatePicker, Button, Card } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { departmentOptions } from "../../constants/departmentOptions";
import { TicketCategoryMap } from "../../constants/ticketCategory";

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
    <Card className="dashboard-filters" style={{padding: "0px"}}>
      <Row gutter={12} align="middle">
        <Col flex="auto">
          <Select
            placeholder="Phòng ban"
            allowClear
            onChange={(v) => setFormValues({ ...formValues, Department: v })}
            style={{ width: "100%" }}
            options={departmentOptions}
          />
        </Col>
        <Col flex="auto">
          <Select
            placeholder="Loại yêu cầu"
            allowClear
            onChange={(v) => setFormValues({ ...formValues, Category: v })}
            style={{ width: "100%" }}
            options={Object.entries(TicketCategoryMap).map(([key, values]) => ({
              label: key,
              value: values.join(","),
            }))}
          />
        </Col>
        <Col flex="auto">
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
        <Col>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ background: "#cad5e0" }}
            size="small"
            onClick={handleSearch}
          >
            Lọc
          </Button>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} size="small" onClick={onRefresh}>
            Xóa lọc
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardFilters;
