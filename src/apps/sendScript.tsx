import moment from "moment";
import React, { useEffect, useRef } from "react";
import { Button, Input } from "reactstrap";
import { Table } from "antd";
import { toast } from "react-toastify";
import { Modal, Button as ANTButton } from "antd";
import "./imess.scss";
import { RootState, useAppDispatch, useAppSelector } from "../service/store/store";
import { getFiles, stopStartFile, updatePriority } from "../service/store/sendScript";
import { axiosInstance } from "../service/apis/axios";
import { handleExportExcel } from "../utils/helper";

const STATUS: any = [
  {
    text: "Hoạt động",
    color: "active",
  },
  {
    text: "Dừng",
    color: "blocked",
  },
];

function SendingScript() {
  const timer: any = useRef(null);
  const timer2: any = useRef(null);
  const dispatch = useAppDispatch();
  const getFileStatus = useAppSelector((state: RootState) => state.sendScript);
  const [reset, setReset] = React.useState(Date.now());
  const [fileName, setFileName] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(1);
  const [showInput, setShowInput] = React.useState<number>();
  const [priority, setPriority] = React.useState<string>();

  const columns: any = [
    {
      title: <div className="title xx-small">Tên file</div>,
      dataIndex: "filename",
      render: (filename: string) => <div className="item-table">{filename}</div>,
      sorter: (a: any, b: any) => a.filename.localeCompare(b.filename),
    },
    {
      title: <div className="title xx-small">Ngày tạo</div>,
      dataIndex: "created_at",
      render: (created_at: string) => <div className="item-table">{moment(created_at).format("lll")}</div>,
      sorter: (a: any, b: any) => {
        const f = new Date(a.created_at);
        const l = new Date(b.created_at);
        return f.getTime() - l.getTime();
      },
    },
    {
      title: <div className="title small">Độ ưu tiên</div>,
      dataIndex: "priority",
      render: (_priority: string, record: any, index: number) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              type="number"
              style={{ width: 80 }}
              value={showInput === index ? priority : _priority}
              onChange={(e) => {
                setPriority(e.target.value);
              }}
              onFocus={() => {
                setShowInput(index);
                setPriority(_priority);
              }}
            />
            {showInput === index && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <ANTButton
                  disabled={priority === ""}
                  loading={getFileStatus.loading}
                  style={{ backgroundColor: "#7FFF00", border: "none", margin: "0px 10px" }}
                  onClick={() => handleChangePriority(record.filename)}
                >
                  <img
                    src="/assets/icons/mark.svg"
                    alt=""
                  />
                </ANTButton>
                <ANTButton
                  onClick={() => setShowInput(-1)}
                  style={{ backgroundColor: "#FF0000", border: "none" }}
                >
                  <img
                    src="/assets/icons/x.svg"
                    alt=""
                  />
                </ANTButton>
              </div>
            )}
          </div>
        );
      },
      sorter: (a: any, b: any) => a.priority - b.priority,
    },
    {
      title: <div className="title xx-small ant-table-column-title">Trạng thái</div>,
      dataIndex: "stop",
      render: (stop: number) => <div className={`item-table ${STATUS[stop].color}`}>{STATUS[stop].text}</div>,
    },
    {
      title: <div className="title small">Tổng</div>,
      dataIndex: "total",
      render: (total: number) => <div className="item-table">{total}</div>,
      sorter: (a: any, b: any) => a.total - b.total,
    },
    {
      title: <div className="title x-small">Đã gửi</div>,
      dataIndex: "success",
      render: (success: number) => <div className="item-table sms-success">{success}</div>,
      sorter: (a: any, b: any) => a.total - b.total,
    },
    {
      title: <div className="title small">Thất bại</div>,
      dataIndex: "fail",
      render: (fail: string) => <div className="item-table error-count">{fail}</div>,
      sorter: (a: any, b: any) => a.fail - b.fail,
    },
    {
      title: <div className="title small">Chưa gửi</div>,
      render: (record: any) => <div className="item-table">{record.total - record.success - record.fail}</div>,
      sorter: (a: any, b: any) => a.total - b.total,
    },
    {
      title: <div className="title ant-table-column-title">Hành động</div>,
      dataIndex: "id",
      render: (id: number, record: any) => (
        <div className="item-table action">
          <Button
            size="sm"
            color="primary"
            onClick={async () => {
              const rs: any = await axiosInstance.get(
                "/send-imess/get-imess-to-send?page=1&size=1000000&fileName=" + record.filename,
              );
              handleExportExcel(rs.result, record.filename.split(".")[0]);
            }}
          >
            Xuất file
          </Button>
          {record.stop === 0 ? (
            <Button
              size="sm"
              color="danger"
              onClick={async () => {
                dispatch(
                  stopStartFile({
                    filename: record.filename,
                    body: {
                      stop: 1,
                    },
                  }),
                );
              }}
            >
              Dừng
            </Button>
          ) : (
            <Button
              size="sm"
              color="success"
              onClick={async () => {
                dispatch(
                  stopStartFile({
                    filename: record.filename,
                    body: {
                      stop: 0,
                    },
                  }),
                );
              }}
            >
              Bật lên
            </Button>
          )}
          {/* <Button className="mr-2 mt-2" size="sm" color="danger" onClick={() => handleDelete(record)}>
            Xoá file
          </Button> */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    clearTimeout(timer2.current);
    clearInterval(timer.current);
    if (fileName) {
      timer.current = setInterval(() => {
        checkFileUploaded();
      }, 10000);

      timer2.current = setTimeout(() => {
        clearInterval(timer.current);
      }, 1000 * 60 * 30);
    }
  }, [fileName, page]);

  const checkFileUploaded = async () => {
    try {
      const data: any = await axiosInstance.get("/sms/get-files-status", {
        params: {
          from: 1,
          to: new Date().getTime(),
          page,
          size: 50,
        },
      });

      if (data.result.filter((i: any) => i.filename === fileName).length <= 0) {
        clearInterval(timer.current);
        clearTimeout(timer2.current);
        setFileName(null);
        toast.success("Xoá file thành công");
        setReset(Date.now());
      }
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(
      getFiles({
        from: 1,
        to: new Date().getTime(),
        page,
        size: 50,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, page]);

  //   const handleDelete = (item: any) => {
  //     Modal.confirm({
  //       title: 'Xác nhận',
  //       content: 'Bạn có chắc chắn muốn xóa kịch bản gửi tin này?',
  //       okText: 'Xoá',
  //       cancelText: 'Huỷ',
  //       onOk: async () => {
  //         setFileName(item.filename);
  //         await axiosInstance.delete(`/sms/remove-by-file-name/${item.filename}`);
  //       },
  //     });
  //   };

  const handleChangePage = (action: string, currentPage?: number) => {
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
        setPage(getFileStatus.listFileStatus.last_page);
        break;
      case "NUMBER":
        setPage(currentPage ? currentPage : 1);
        break;

      default:
        break;
    }
  };

  const handleChangePriority = (filename: string) => {
    dispatch(updatePriority({ filename, body: { priority: Number(priority) }, action: setShowInput }));
  };

  return (
    <div className="p-2">
      <h1>Kịch bản gửi tin</h1>
      {/* <div className="d-flex justify-content-end">
        <Button
          color="primary"
          className="mb-2"
          onClick={() => {
            // history.push(RoutesConstants.GSM_Add_New);
          }}
        >
          Thêm mới
        </Button>
      </div> */}

      <div>
        <Table
          columns={columns}
          dataSource={getFileStatus.listFileStatus.result}
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
                Trang {page} / {getFileStatus.listFileStatus.last_page}
              </span>
            </li>
            <li className={`page-item ${page >= getFileStatus.listFileStatus.last_page ? "pe-none" : ""}`}>
              <span
                className="page-link"
                onClick={() => handleChangePage("NEXT")}
              >
                {">"}
              </span>
            </li>
            <li className={`page-item ${page >= getFileStatus.listFileStatus.last_page ? "pe-none" : ""}`}>
              <span
                className="page-link"
                onClick={() => handleChangePage("LAST")}
              >
                {">>"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SendingScript;
