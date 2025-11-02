import React from "react";
import { Modal } from "antd";

const NewsViewModal = ({ open, onClose, item }) => {
  if (!item) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      title="View News"
      bodyStyle={{ padding: "2rem" }}
    >
      <div className="space-y-4">
        <img
          src={item.image}
          alt="news"
          className="w-full h-60 object-cover rounded-lg border"
        />
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <div
          className="text-gray-700 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </div>
    </Modal>
  );
};

export default NewsViewModal;
