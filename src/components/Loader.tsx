import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

type LoaderProps = {
  label?: string;
};

const Loader = ({ label }: LoaderProps) => {
  return (
    <span style={{ fontSize: "1rem", color: "#1890ff" }}>
      <LoadingOutlined style={{ fontSize: "1.25rem" }} />
      <span style={{ marginLeft: 10 }}>{label || "Loading..."}</span>
    </span>
  );
};

export default Loader;
