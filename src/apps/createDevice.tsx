import { useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { createDevice } from "../service/store/device.reducer";
import { useAppDispatch } from "../service/store/store";
import "./imess.scss";

function CreateDevicePage() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");

  const handleSubmit = async () => {
    dispatch(createDevice({ name, url, username, password, serialNumber }));
  };

  return (
    <div className="p-2">
      <h1>Thêm Device</h1>
      <Row className="">
        <Col
          xs="12"
          sm="2"
          md="6"
        >
          <div className="form-search mb-2">
            <Label className="label">Tên: </Label>
            <Input
              placeholder="Tên ..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="6"
        >
          <div className="form-search mb-2">
            <Label className="label">Số seri: </Label>
            <Input
              placeholder="Số seri"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="6"
        >
          <div className="form-search mb-2">
            <Label className="label">URL: </Label>
            <Input
              placeholder="Tìm kiếm ..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="6"
        >
          <div className="form-search mb-2">
            <Label className="label">Username: </Label>
            <Input
              placeholder="Username ..."
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="6"
        >
          <div className="form-search mb-2">
            <Label className="label">Password: </Label>
            <Input
              placeholder="Password ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="12"
        >
          <Button
            color="primary"
            onClick={handleSubmit}
            className="mt-4"
          >
            Tạo mới
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default CreateDevicePage;
