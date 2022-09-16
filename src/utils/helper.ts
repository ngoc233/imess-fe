import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export const handleExportExcel = (dt: any, filename: string) => {
  const newData: any = dt.map(({ sender, ...obj }: any) => obj);
  const ws = XLSX.utils.json_to_sheet(newData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, filename.split(".")[0] + fileExtension);
};
