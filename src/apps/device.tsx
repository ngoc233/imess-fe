import moment from "moment";
import { useEffect, Dispatch, useState, SetStateAction } from "react";
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input } from "reactstrap";
import { Table } from "antd";
import "./imess.scss";
import { RootState, useAppDispatch, useAppSelector } from "../service/store/store";
import { useNavigate } from "react-router-dom";
import {
  blockOrUnblock,
  CreateDeviceDto,
  deleteDevice,
  getDevices,
  updateDevice,
} from "../service/store/device.reducer";
import { routerPaths } from "../utils/constanst";

function UpdateModal({
  setToggleModal,
  itemAction,
}: {
  setToggleModal: Dispatch<SetStateAction<boolean>>;
  itemAction: Partial<CreateDeviceDto & { id: string }>;
}) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>(itemAction.name || "");
  const [url, setUrl] = useState<string>(itemAction.url || "");
  const [username, setUserName] = useState<string>(itemAction.username || "");
  const [password, setPassword] = useState<string>(itemAction.password || "");
  const [serialNumber, setSerialNumber] = useState<string>(itemAction.serialNumber || "");

  const handleUpdate = () => {
    if (itemAction.id) {
      dispatch(
        updateDevice({
          id: itemAction.id,
          body: {
            name,
            url,
            username,
            password,
            serialNumber,
          },
        }),
      );
      setToggleModal((prev) => !prev);
    }
  };

  return (
    <>
      <ModalBody>
        <Row>
          <Col xs="6">
            <div className="item-form-modal-gms">
              <Label>Tên: </Label>
              <Input
                placeholder="Tên ..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </Col>
          <Col xs="6">
            <div className="item-form-modal-gms">
              <Label>Số seri</Label>
              <Input
                placeholder="Số seri"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          </Col>
          <Col xs="6">
            <div className="item-form-modal-gms">
              <Label>URL: </Label>
              <Input
                placeholder="Tìm kiếm ..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </Col>
          <Col xs="6">
            <div className="item-form-modal-gms">
              <Label>Username: </Label>
              <Input
                placeholder="Login Username ..."
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </Col>
          <Col xs="6">
            <div className="item-form-modal-gms">
              <Label>Password: </Label>
              <Input
                placeholder="Tìm kiếm ..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleUpdate}
        >
          Lưu
        </Button>
        <Button onClick={() => setToggleModal((prev) => !prev)}>Huỷ</Button>
      </ModalFooter>
    </>
  );
}

function Device() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const listDevices: Partial<CreateDeviceDto & { id: string }>[] = useAppSelector(
    (state: RootState) => state.device.devices,
  );
  const [toggleModal, setToggleModal] = useState(false);
  const [typeModal, setTypeModal] = useState<"update" | "delete">();
  const [itemAction, setItemAction] = useState<Partial<CreateDeviceDto & { id: string }>>({});

  const columns: any = [
    {
      title: <div className="title small">ID</div>,
      dataIndex: "id",
      render: (id: number) => <div className="item-table">{id}</div>,
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: <div className="title x-small">Tên</div>,
      dataIndex: "name",
      render: (name: string) => <div className="item-table">{name}</div>,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: <div className="title x-small">Số seri</div>,
      dataIndex: "serialNumber",
      render: (code: string) => <div className="item-table">{code}</div>,
      sorter: (a: any, b: any) => a.code.localeCompare(b.code),
    },
    {
      title: <div className="title xx-small">Trạng thái</div>,
      dataIndex: "blocked",
      render: (blocked: boolean, record: CreateDeviceDto & { id: string }) => (
        <div
          className={`item-table ${blocked ? "blocked" : "active"}`}
          onClick={() => dispatch(blockOrUnblock({ id: record.id, body: { block: !blocked } }))}
        >
          {blocked ? "BLOCKED" : "ACTIVE"}
        </div>
      ),
    },
    {
      title: <div className="title xx-large">Thời gian tạo</div>,
      dataIndex: "createdAt",
      render: (createdAt: string) => <div className="item-table">{moment(createdAt).format("lll")}</div>,
      sorter: (a: any, b: any) => {
        const f = new Date(a.createdAt);
        const l = new Date(b.createdAt);
        return f.getTime() - l.getTime();
      },
    },
    {
      title: <div className="title xx-large">Hành động</div>,
      dataIndex: "id",
      render: (id: string, record: any) => (
        <div className="item-table">
          <Button
            className="mr-2"
            size="sm"
            color="info"
            onClick={() => {
              setTypeModal("update");
              setItemAction(record);
              setToggleModal((prev) => !prev);
            }}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => {
              setTypeModal("delete");
              setItemAction(record);
              setToggleModal((prev) => !prev);
            }}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    if (itemAction.id) {
      dispatch(deleteDevice(itemAction.id));
    }
    setToggleModal((prev) => !prev);
  };

  const handleToggleModal = () => {
    setToggleModal((prev) => !prev);
  };
  useEffect(() => {
    dispatch(getDevices());
  }, []);

  return (
    <div className="p-2">
      <h1>Danh sách máy GSM</h1>
      <div className="d-flex justify-content-end">
        <Button
          color="primary"
          className="mb-2"
          onClick={() => {
            navigate(`/${routerPaths.creatDevice}`);
          }}
        >
          Thêm mới
        </Button>
      </div>
      <Row className="">
        <Col
          xs="12"
          sm="2"
          md="4"
        ></Col>
        <Col
          xs="12"
          sm="2"
          md="4"
        ></Col>
      </Row>
      <Table
        columns={columns}
        dataSource={listDevices}
      />
      <Modal
        isOpen={toggleModal}
        toggle={handleToggleModal}
        centered
        zIndex={1111}
      >
        <ModalHeader toggle={() => setToggleModal(false)}>{typeModal === "update" ? "Sửa GMS" : "Xóa GMS"}</ModalHeader>
        {typeModal === "update" ? (
          <UpdateModal
            setToggleModal={setToggleModal}
            itemAction={itemAction}
          />
        ) : (
          <>
            <ModalBody>Xác nhận xóa {itemAction.name}</ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onClick={handleDelete}
              >
                Xóa
              </Button>
              <Button onClick={handleToggleModal}>Huỷ</Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Device;
