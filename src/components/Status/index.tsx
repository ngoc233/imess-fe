export type StatusType = "FAIL" | "SUCCESS" | "PENDING" | "SENDING" | "NOIMESS";
export const StatusText = {
  FAIL: "Thất bại",
  SUCCESS: "Thành công",
  PENDING: "Đang chờ",
  SENDING: "Đang gửi",
  NOIMESS: "Noimess",
};

export function getStatus(status: StatusType) {
  return StatusText[status];
}
