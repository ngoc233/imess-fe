import moment from "moment";
import React, { useEffect } from "react";
import Select from "react-select";
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input } from "reactstrap";
import { Table } from "antd";
import "./imess.scss";
import { RootState } from "../service/store/store";
import { useNavigate } from "react-router-dom";

// const labelStatus = {
//   ACTIVE: "Hoạt động",
//   off: "Tắt",
//   stop: "Tạm dừng",
// };
// function UpdateModal({
//   setToggleModal,
//   itemAction,
// }: {
//   setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
//   itemAction: Partial<GSMDetail>;
// }) {
//   const dispatch = useAppDispatch();
//   const [name, setName] = React.useState<string>(itemAction.name || "");
//   const [code, setCode] = React.useState<string>(itemAction.code || "");
//   const [status, setStatus] = React.useState<"ACTIVE" | "off" | "stop">(itemAction.status || "ACTIVE");
//   const [url, setUrl] = React.useState<string>(itemAction.url || "");
//   const [username, setUserName] = React.useState<string>(itemAction.username || "");
//   const [password, setPassword] = React.useState<string>(itemAction.password || "");

//   const handleUpdate = () => {
//     dispatch(
//       updateGSM({
//         id: itemAction.id,
//         data: {
//           name,
//           code,
//           status,
//           url,
//           username,
//           password,
//         },
//       }),
//     );
//     setToggleModal((prev) => !prev);
//   };

//   return (
//     <>
//       <ModalBody>
//         <Row>
//           <Col xs="6">
//             <div className="item-form-modal-gms">
//               <Label>Tên: </Label>
//               <Input
//                 placeholder="Tên ..."
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//           </Col>
//           <Col xs="6">
//             <div className="item-form-modal-gms">
//               <Label>Mã máy:</Label>
//               <Input
//                 placeholder="Mã máy ..."
//                 value={code}
//                 onChange={(e) => setCode(e.target.value)}
//               />
//             </div>
//           </Col>
//           <Col xs="6">
//             <div className="item-form-modal-gms">
//               <Label>Trạng thái: </Label>
//               <Select
//                 value={{ value: status, label: labelStatus[status] }}
//                 placeholder="Trạng thái"
//                 onChange={(v: any) => setStatus(v.value)}
//                 options={[
//                   { value: "ACTIVE", label: "Hoạt động" },
//                   { value: "off", label: "Tắt" },
//                   { value: "stop", label: "Tạm dừng" },
//                 ]}
//               />
//             </div>
//           </Col>
//           <Col xs="6">
//             <div className="item-form-modal-gms">
//               <Label>URL: </Label>
//               <Input
//                 placeholder="Tìm kiếm ..."
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//               />
//             </div>
//           </Col>
//           <Col xs="6">
//             <div className="item-form-modal-gms">
//               <Label>Username: </Label>
//               <Input
//                 placeholder="Login Username ..."
//                 value={username}
//                 onChange={(e) => setUserName(e.target.value)}
//               />
//             </div>
//           </Col>
//           <Col xs="6">
//             <div className="item-form-modal-gms">
//               <Label>Password: </Label>
//               <Input
//                 placeholder="Tìm kiếm ..."
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </Col>
//         </Row>
//       </ModalBody>
//       <ModalFooter>
//         <Button
//           color="primary"
//           onClick={handleUpdate}
//         >
//           Lưu
//         </Button>
//         <Button onClick={() => setToggleModal((prev) => !prev)}>Huỷ</Button>
//       </ModalFooter>
//     </>
//   );
// }

function Device() {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // const listGSM: GSMDetail[] = useAppSelector((state: RootState) => state.gsm.list);
  // const [toggleModal, setToggleModal] = React.useState(false);
  // const [typeModal, setTypeModal] = React.useState<"update" | "delete">();
  // const [itemAction, setItemAction] = React.useState<Partial<GSMDetail>>({});

  // const columns: any = [
  //   {
  //     title: <div className="title small">ID</div>,
  //     dataIndex: "id",
  //     render: (id: number) => <div className="item-table">{id}</div>,
  //     sorter: (a: any, b: any) => a.id - b.id,
  //   },
  //   {
  //     title: <div className="title x-small">Tên</div>,
  //     dataIndex: "name",
  //     render: (name: string) => <div className="item-table">{name}</div>,
  //     sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  //   },
  //   {
  //     title: <div className="title xx-small">Mã máy</div>,
  //     dataIndex: "code",
  //     render: (code: string) => <div className="item-table">{code}</div>,
  //     sorter: (a: any, b: any) => a.code.localeCompare(b.code),
  //   },
  //   {
  //     title: <div className="title medium">Trạng thái</div>,
  //     dataIndex: "status",
  //     render: (status: "ACTIVE" | "off" | "stop") => <div className="item-table">{labelStatus[status] || "N/A"}</div>,
  //     filters: [
  //       {
  //         text: "Active",
  //         value: "ACTIVE",
  //       },
  //       {
  //         text: "Off",
  //         value: "off",
  //       },
  //       {
  //         text: "Stop",
  //         value: "stop",
  //       },
  //     ],
  //     onFilter: (value: string, record: any) => record.status === value,
  //   },
  //   {
  //     title: <div className="title xx-large">Thời gian tạo</div>,
  //     dataIndex: "createdAt",
  //     render: (createdAt: string) => <div className="item-table">{moment(createdAt).format("lll")}</div>,
  //     sorter: (a: any, b: any) => {
  //       const f = new Date(a.createdAt);
  //       const l = new Date(b.createdAt);
  //       return f.getTime() - l.getTime();
  //     },
  //   },
  //   {
  //     title: <div className="title xx-large">Hành động</div>,
  //     dataIndex: "id",
  //     render: (id: number, record: any) => (
  //       <div className="item-table">
  //         <Button
  //           className="mr-2"
  //           size="sm"
  //           color="primary"
  //           onClick={() => {
  //             navigate(`/gsm/access/${id}`);
  //             dispatch(getCurrentGSM(id));
  //           }}
  //         >
  //           Truy cập
  //         </Button>
  //         <Button
  //           className="mr-2"
  //           size="sm"
  //           color="info"
  //           onClick={() => {
  //             setTypeModal("update");
  //             setItemAction(record);
  //             setToggleModal((prev) => !prev);
  //           }}
  //         >
  //           Sửa
  //         </Button>
  //         <Button
  //           size="sm"
  //           color="danger"
  //           onClick={() => {
  //             setTypeModal("delete");
  //             setItemAction(record);
  //             setToggleModal((prev) => !prev);
  //           }}
  //         >
  //           Xoá
  //         </Button>
  //       </div>
  //     ),
  //   },
  // ];

  // const handleDelete = () => {
  //   dispatch(deleteGSM(itemAction.id));
  //   setToggleModal((prev) => !prev);
  // };

  // const handleToggleModal = () => {
  //   setToggleModal((prev) => !prev);
  // };
  // useEffect(() => {
  //   dispatch(getListGSM());
  // }, []);

  // return (
  //   <div className="p-2">
  //     <h1>Danh sách máy GSM</h1>
  //     <div className="d-flex justify-content-end">
  //       <Button
  //         color="primary"
  //         className="mb-2"
  //         onClick={() => {
  //           history.push(RoutesConstants.GSM_Add_New);
  //         }}
  //       >
  //         Thêm mới
  //       </Button>
  //     </div>
  //     <Row className="">
  //       <Col
  //         xs="12"
  //         sm="2"
  //         md="4"
  //       ></Col>
  //       <Col
  //         xs="12"
  //         sm="2"
  //         md="4"
  //       ></Col>
  //     </Row>
  //     <Table
  //       columns={columns}
  //       dataSource={listGSM}
  //     />
  //     <Modal
  //       isOpen={toggleModal}
  //       toggle={handleToggleModal}
  //       centered
  //       zIndex={1111}
  //     >
  //       <ModalHeader toggle={() => setToggleModal(false)}>{typeModal === "update" ? "Sửa GMS" : "Xóa GMS"}</ModalHeader>
  //       {typeModal === "update" ? (
  //         <UpdateModal
  //           setToggleModal={setToggleModal}
  //           itemAction={itemAction}
  //         />
  //       ) : (
  //         <>
  //           <ModalBody>Xác nhận xóa {itemAction.name}</ModalBody>
  //           <ModalFooter>
  //             <Button
  //               color="danger"
  //               onClick={handleDelete}
  //             >
  //               Xóa
  //             </Button>
  //             <Button onClick={handleToggleModal}>Huỷ</Button>
  //           </ModalFooter>
  //         </>
  //       )}
  //     </Modal>
  //   </div>
  // );
  return <></>;
}

export default Device;
