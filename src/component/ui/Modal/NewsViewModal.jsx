// src/component/ui/Modal/NewsViewModal.jsx
import React from "react";
import { Modal } from "antd";
import { useGetSingleNewsQuery } from "../../../redux/features/news/news";

const NewsViewModal = ({ open, onClose, item }) => {
  const {data} = useGetSingleNewsQuery(item?.id, {
    skip: !open || !item?.id,
  });
  const newsData = data?.data || null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      title="View News"
      bodyStyle={{ padding: "2rem" }}
      destroyOnClose
    >
      <div className="space-y-4">
        {newsData?.headerImage ? (
          <img
            src={newsData?.headerImage}
            alt="news"
            className="w-full h-60 object-cover rounded-lg border"
          />
        ) : null}
        <h3 className="text-lg font-semibold">{newsData?.title}</h3>
        <div className="text-gray-700 text-sm" />
        <div
          dangerouslySetInnerHTML={{
            __html: newsData?.content || "",
          }}
        />
      </div>
    </Modal>
  );
};

export default NewsViewModal;
