import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { toast } from "react-toastify";
import { Button, Col, Input, Label, ModalBody, ModalFooter, ModalHeader, Row, Modal as RCModal } from "reactstrap";
import { Table } from "antd";
import "./imess.scss";
import { RootState, useAppDispatch, useAppSelector } from "../service/store/store";
import { getStatus, StatusType } from "../components/Status";
import { getImessToSend, Imess } from "../service/store/imess.reducer";
import ExcelReader from "../components/ReadFile";
import { handleExportExcel } from "../utils/helper";
import { getDevices } from "../service/store/device.reducer";

interface ISearch {
  size: number;
  from: Date;
  to: Date;
  fileName: string;
  filterStatus: string;
  filterMode: string;
  sender: string;
  receiver: string;
  deviceId: number;
}
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: 1200,
  },
};

function GSMSent() {
  const dispatch = useAppDispatch();
  const listSmsToSend = useAppSelector((state: RootState) => state.imess.listImess);
  const devices = useAppSelector((state: RootState) => state.device.devices);
  const [page, setPage] = useState<number>(1);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [dataExport, setDataExport] = useState({
    last_page: 0,
    result: [],
    total: 0,
  });
  const [form, setForm] = useState<ISearch>({
    size: 32,
    //@ts-ignore
    from: new Date(moment(new Date()).hour(0).minute(0).second(0)._d.getTime() - 30 * 86400000),
    //@ts-ignore
    to: new Date(moment(new Date()).hour(23).minute(59).second(59)._d.getTime()),
    fileName: "",
    filterStatus: "",
    filterMode: "",
    sender: "",
    receiver: "",
    deviceId: 0,
  });

  const columns: any = [
    {
      title: <div className="title small">ID Device</div>,
      dataIndex: "deviceId",
      render: (deviceId: number) => <div className="item-table">{deviceId}</div>,
      sorter: (a: any, b: any) => a.deviceId - b.deviceId,
    },
    {
      title: <div className="title xx-small">File</div>,
      dataIndex: "filename",
      render: (filename: string) => <div className="item-table medium">{filename}</div>,
      sorter: (a: any, b: any) => a.filename.localeCompare(b.filename),
    },
    {
      title: <div className="title x-small">Người nhận</div>,
      dataIndex: "receiver",
      render: (receiver: string) => <div className="item-table">{receiver}</div>,
      sorter: (a: any, b: any) => a.receiver.localeCompare(b.receiver),
    },
    {
      title: <div className="title large mxx-large  ant-table-column-title">Nội dung</div>,
      dataIndex: "message",
      render: (message: string) => <div className="item-table content ellipsis">{message}</div>,
    },
    {
      title: <div className="title x-small">Thời gian</div>,
      dataIndex: "createdAt",
      render: (createdAt: string) => <div className="item-table">{moment(createdAt).format("L")}</div>,
      sorter: (a: any, b: any) => {
        const f = new Date(a.createdAt);
        const l = new Date(b.createdAt);
        return f.getTime() - l.getTime();
      },
    },
    {
      title: <div className="title x-small ant-table-column-title">Trạng thái</div>,
      dataIndex: "status",
      render: (status: StatusType) => <div className="item-table">{getStatus(status)}</div>,
    },
    {
      title: <div className="title ant-table-column-title">Thao tác</div>,
      render: (record: any) => {
        return (
          <Button
            color="info"
            className="mr-2"
            size="sm"
            onClick={() => {
              handleDetail(record);
            }}
          >
            Chi tiết
          </Button>
        );
      },
    },
  ];

  const handleSubmit = () => {
    if (new Date(form.from).getTime() >= new Date(form.to).getTime()) {
      toast.error("Ngày nhập không hợp lệ.");
      return;
    }

    dispatch(
      getImessToSend({
        ...form,
        page,
        from: form.from.getTime(),
        to: form.to.getTime(),
      }),
    );
  };

  const handleReset = () => {
    setForm({
      size: 32,
      //@ts-ignore
      from: new Date(moment(new Date()).hour(0).minute(0).second(0)._d.getTime() - 30 * 86400000),
      //@ts-ignore
      to: new Date(moment(new Date()).hour(23).minute(59).second(59)._d.getTime()),
      fileName: "",
      filterStatus: "",
      filterMode: "",
      sender: "",
      receiver: "",
      deviceId: 0,
    });
  };

  const handleDetail = (u: Imess) => {
    setShowDetail(u);
  };

  const handleChangePage = (action: string, currentPage?: number) => {
    console.log("currentPage: ", currentPage);
    console.log("action: ", action);

    switch (action) {
      case "FIRST":
        setPage(1);
        break;
      case "PREV":
        setPage((p) => p - 1);

        break;
      case "NEXT":
        setPage((p) => p + 1);

        break;
      case "LAST":
        listSmsToSend.last_page && setPage(listSmsToSend.last_page);
        break;
      case "NUMBER":
        setPage(currentPage ? currentPage : 1);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(getDevices());
  }, []);

  useEffect(() => {
    dispatch(
      getImessToSend({
        ...form,
        page: page,
        from: form.from.getTime(),
        to: form.to.getTime(),
      }),
    );
  }, [page]);

  return (
    <div className="p-2">
      <h3>Tin nhắn gửi</h3>
      <div className="d-flex justify-content-end">
        <Button
          color="primary"
          onClick={() => handleExportExcel(listSmsToSend.result, "imess-data")}
          className="ml-2"
        >
          Xuất file
        </Button>
      </div>
      <ExcelReader />
      <br />
      <Row className="">
        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label className="label">Người nhận: </Label>
            <Input
              placeholder="Người nhận ..."
              value={form.receiver}
              onChange={(e) => setForm({ ...form, receiver: e.target.value })}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label className="label">Tên file: </Label>
            <Input
              placeholder="Tên file ..."
              value={form.fileName}
              onChange={(e) => setForm({ ...form, fileName: e.target.value })}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label className="label">Trạng thái: </Label>

            <Select
              placeholder="Trạng thái ..."
              options={[
                { value: "FAIL", label: "Thất bại" },
                { value: "SUCCESS", label: "Thành công" },
                { value: "PENDING", label: "Đang chờ" },
              ]}
              onChange={(e: any) => setForm({ ...form, filterStatus: e.value })}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label className="label">Device: </Label>
            <Select
              placeholder="Device ..."
              options={devices.map((d) => ({ value: d.id, label: d.name }))}
              onChange={(e: any) => setForm({ ...form, filterMode: e.value })}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label className="label">Chế độ: </Label>
            <Select
              placeholder="Chế độ ..."
              options={[
                { value: "AUTO", label: "Auto" },
                { value: "SPAM", label: "Spam" },
                { value: "MANUAL", label: "Manual" },
              ]}
              onChange={(e: any) => setForm({ ...form, filterMode: e.value })}
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label className="label">Ngày bắt đầu: </Label>
            <DatePicker
              selected={form.from}
              onChange={(date: Date) => setForm({ ...form, from: new Date(date) })}
              selectsStart
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
            />
          </div>
        </Col>
        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label className="label">Ngày kết thúc: </Label>
            <DatePicker
              selected={form.to}
              onChange={(date: Date) => setForm({ ...form, to: new Date(date) })}
              selectsStart
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
            />
          </div>
        </Col>

        <Col
          xs="12"
          sm="2"
          md="3"
        >
          <div className="form-search">
            <Label style={{ color: "transparent" }}>{"Tìm kiếm"}</Label>
            <div>
              <Button
                color="primary"
                onClick={handleSubmit}
                className="mr-2"
              >
                Tìm kiếm
              </Button>
              <Button
                color="primary"
                onClick={handleReset}
                className="ml-2 mr-2"
              >
                Mặc định
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <h3>Danh sách tin nhắn gửi</h3>
      <div
        aria-label="Page navigation example"
        style={{ cursor: "pointer" }}
      >
        <ul className="pagination justify-content-end">
          <li className={`page-item ${page === 1 ? "pe-none" : ""}`}>
            <span
              className={`page-link ${page === 1 ? "text-opacity-50" : ""}`}
              onClick={() => handleChangePage("FIRST")}
            >
              {"<<"}
            </span>
          </li>
          <li className={`page-item ${page === 1 ? "pe-none" : ""}`}>
            <span
              className={`page-link ${page === 1 ? "text-opacity-50" : ""}`}
              onClick={() => handleChangePage("PREV")}
            >
              {"<"}
            </span>
          </li>
          <li className={`page-item pe-none `}>
            <span className="page-link">
              Trang {page} / {listSmsToSend.last_page}
            </span>
          </li>
          <li className={`page-item ${page >= listSmsToSend.last_page ? "pe-none" : ""}`}>
            <span
              className={`page-link ${page >= listSmsToSend.last_page ? "text-opacity-50" : ""}`}
              onClick={() => handleChangePage("NEXT")}
            >
              {">"}
            </span>
          </li>
          <li className={`page-item ${page >= listSmsToSend.last_page ? "pe-none" : ""}`}>
            <span
              className={`page-link ${page >= listSmsToSend.last_page ? "text-opacity-50" : ""}`}
              onClick={() => handleChangePage("LAST")}
            >
              {">>"}
            </span>
          </li>
        </ul>
      </div>
      <Table
        columns={columns}
        dataSource={listSmsToSend.result}
        pagination={false}
      />
      <div
        aria-label="Page navigation example"
        style={{ cursor: "pointer" }}
      >
        <ul className="pagination justify-content-end">
          <li className={`page-item ${page === 1 ? "pe-none" : ""}`}>
            <span
              className="page-link"
              onClick={() => handleChangePage("FIRST")}
            >
              {"<<"}
            </span>
          </li>
          <li className={`page-item ${page === 1 ? "pe-none" : ""}`}>
            <span
              className="page-link"
              onClick={() => handleChangePage("PREV")}
            >
              {"<"}
            </span>
          </li>
          <li className={`page-item pe-none `}>
            <span className="page-link">
              Trang {page} / {listSmsToSend.last_page}
            </span>
          </li>
          <li className={`page-item ${page >= listSmsToSend.last_page ? "pe-none" : ""}`}>
            <span
              className="page-link"
              onClick={() => handleChangePage("NEXT")}
            >
              {">"}
            </span>
          </li>
          <li className={`page-item ${page >= listSmsToSend.last_page ? "pe-none" : ""}`}>
            <span
              className="page-link"
              onClick={() => handleChangePage("LAST")}
            >
              {">>"}
            </span>
          </li>
        </ul>
      </div>
      <RCModal
        isOpen={!!showDetail}
        toggle={() => setShowDetail(null)}
        centered
      >
        <ModalHeader toggle={() => setShowDetail(null)}>Chi tiết tin gửi</ModalHeader>
        <ModalBody>
          {showDetail && (
            <>
              <p>
                <b>ID Device:</b> {showDetail.deviceId}
              </p>
              <p>
                <b>Tên file:</b> {showDetail.filename}
              </p>
              <p>
                <b>Người nhận:</b> {showDetail.receiver}
              </p>
              <p>
                <b>Nội dung:</b>
                <br />
                {showDetail.message}
              </p>
              <p>
                <b>Thời gian:</b> {moment(showDetail.createdAt).format("DD/MM/YYYY - HH:mm:ss")}
              </p>
              <p>
                <b>Trạng thái:</b>
                {getStatus(showDetail.status)}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowDetail(null)}>Huỷ</Button>
        </ModalFooter>
      </RCModal>
    </div>
  );
}

export default GSMSent;
