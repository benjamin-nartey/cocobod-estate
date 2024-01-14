import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";



const PhotosUploader = ({ props, handleChange, fileList }) => {
  const { Dragger } = Upload;
  return (
    <Dragger
      multiple
      accept={"image/png, image/jpeg, image/jpg"}
      listType="picture"
      {...props}
      // onChange={handleChange}
      // fileList={fileList}
    >
      <p className="ant-upload-drag-icon">
        <PlusOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag image files to this area to upload
      </p>
      <p className="ant-upload-hint">Support for a single or bulk upload.</p>
    </Dragger>
  );
};
export default PhotosUploader;
