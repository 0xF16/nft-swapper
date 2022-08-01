import React from "react";
import { Typography, Avatar } from "antd";
import logo from "../nft_swapper_logo_transparent.png";

const { Title, Text } = Typography;
// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem" }}>
      <Avatar size={128} shape="square" src={logo}></Avatar>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "#",
  title: "💱 NFT Swapper",
  subTitle: "Simple swapper for your NFTs",
};
