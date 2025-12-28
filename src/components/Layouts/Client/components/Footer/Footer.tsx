import { Link } from "react-router-dom";
import bctLogo from "../../../../../assets/bct-registered.svg";

const Footer = () => {
  return (
    <>
      <div className="w-full mx-auto bg-[#1d1d1d]">
        <div className="mx-5 md:mx-20 lg:mx-40 py-8 md:items-center flex md:flex-row justify-between flex-col items-start gap-10">
          <div>
            <Link to="/" className="flex flex-col gap-4">
              <img
                src="/ticketgo_logo.png"
                alt="TicketGo"
                width="127"
                height="41"
              ></img>
              <p className="text-md text-[#b3b3b3]">
                Nền tảng quản lý và phân phối vé sự kiện hàng đầu Việt Nam ©
                2017
              </p>
            </Link>
          </div>
          <div className="text-md font-semibold text-[#b3b3b3] flex flex-col gap-2">
            <a>Về chúng tôi</a>
            <a>Dành cho khách hàng</a>
            <a>Điều khoản sử dụng</a>
            <a>Đối tác của chúng tôi</a>
          </div>

          <div className="text-md font-semibold text-[#b3b3b3] flex flex-col gap-2">
            <a>Dịch vụ và ưu đãi</a>
            <a>Khuyến mại</a>
            <a>Liên hệ chúng tôi</a>
          </div>

          <div>
            <a
              target="_blank"
              href="http://online.gov.vn/Home/WebDetails/23180"
            >
              <img src={bctLogo} width={150} alt="confirm" />
            </a>
          </div>
        </div>
        <div className="mx-5 md:mx-40 py-8">
          <p className="text-xl text-white font-semibold py-2">
            Công ty TNHH TicketGo
          </p>
          <div className="flex flex-col gap-1 text-[#b3b3b3] font-light">
            <p>Đại diện theo pháp luật: Trịnh Trần Phương Tuấn</p>
            <p>
              Địa chỉ: Tầng 16, Tòa nhà Sai Gon Tower, 29 Lê Duẩn, Phường Bến
              Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam
            </p>
            <p>Hotline: 1900.6408</p>
            <p>Email: support@ticketgo.vn</p>
          </div>
        </div>
        <div className="mx-10 md:mx-40 py-8 items-center border-t border-[#1D2939]">
          <p className="text-md text-white ">
            All rights reserved 2025 © TicketGo
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
