import { useState } from "react";
import { Spinner } from "reactstrap";
import { read, utils } from "xlsx";
import { imessUploadData, ImessUploadDataDto } from "../../service/store/imess.reducer";
import { RootState, useAppDispatch, useAppSelector } from "../../service/store/store";

const typeFile = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map((x) => `.${x}`)
  .join(",");

interface ImessFile {
  phonenumber: string;
  message: string;
}
const ExcelReader = () => {
  const loading = useAppSelector((state: RootState) => state.imess.loading);
  const dispatch = useAppDispatch();
  const [state, setState] = useState<any>({
    file: {},
    data: [],
    key: [],
  });

  const [dataConvert, setDataConvert] = useState<ImessFile[]>([]);
  const [checkFileName, setCheckFileName] = useState(false);
  const [showData, setShowDate] = useState(false);

  const handleChange = (e: any) => {
    const files = e.target.files;
    if (files && files[0]) {
      setState({ ...state, file: files[0] });
      if (typeFile.includes(files[0].name.split(".").pop())) {
        setCheckFileName(true);
      } else setCheckFileName(false);
    }
  };

  const handleFile = (callback?: (data: ImessFile[]) => void) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e: any) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data: ImessFile[] = utils.sheet_to_json(ws, { defval: "" });
      /* Update state */
      setState({
        ...state,
        data: data,
        key: data.length ? Object.keys(data[0]) : [],
      });
      callback || setDataConvert(data);
      callback && callback(data);
    };

    if (rABS) {
      reader.readAsBinaryString(state.file);
    } else {
      reader.readAsArrayBuffer(state.file);
    }
  };

  const handleSubmit = () => {
    if (!dataConvert.length) {
      handleFile((data) => {
        dispatch(
          imessUploadData({
            filename: state.file.name,
            data: data.map((i: { phonenumber: string; message: string }) => ({
              receiver: i.phonenumber,
              message: i.message,
            })),
          }),
        );
      });
    } else {
      dispatch(
        imessUploadData({
          filename: state.file.name,
          data: dataConvert.map((i: { phonenumber: string; message: string }) => ({
            receiver: i.phonenumber,
            message: i.message,
          })),
        }),
      );
    }
  };

  return (
    <>
      <div className="text-right">
        <div
          className="container d-flex"
          style={{ maxWidth: 600 }}
        >
          <input
            type="file"
            className="form-control height-100 mr-2"
            style={{ maxWidth: 400 }}
            id="file"
            accept={typeFile}
            onChange={handleChange}
          />
          <button
            className="btn btn-primary ml-2 mr-2"
            onClick={() => {
              setShowDate(true);
              handleFile();
            }}
            disabled={!checkFileName}
          >
            Xem
          </button>
          <button
            className="btn btn-primary ml-2"
            onClick={handleSubmit}
            disabled={!checkFileName}
          >
            Gửi
          </button>
        </div>
      </div>
      <div className="mt-2">
        {!!dataConvert.length && showData && (
          <table className="table__excel table table-hover table-striped table-bordered">
            <thead>
              <tr>
                <th>STT</th>
                {state.key.map((item: any, id: any) => (
                  <th
                    key={id}
                    scope="col"
                    className="white-space-nowrap"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataConvert.slice(0, 10).map((item, id) => (
                <tr key={id}>
                  <td>{id + 1}</td>
                  {Object.keys(dataConvert[0]).map((key, id: number) => (
                    <td
                      className="white-space-nowrap"
                      key={id}
                    >
                      {
                        //@ts-ignore
                        item[key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {loading && (
        <div className="loading-container">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default ExcelReader;
