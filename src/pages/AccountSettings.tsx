import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Check, X } from "lucide-react";
// @ts-expect-error - JSX file without type declarations
import { useAuth } from "../contexts/AuthContext";
import UserSidebar from "../components/Layouts/Client/UserSidebar";
import axios from "axios";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
  });

  const formatDateToDisplay = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateToInput = (displayDate: string) => {
    if (!displayDate) return "";
    const [day, month, year] = displayDate.split('/');
    return `${year}-${month}-${day}`;
  };

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
        birthDate: user.birthDate ? formatDateToDisplay(user.birthDate) : "",
        gender: user.gender || "",
      });

      if (user.avatar) {
        const avatarUrl = user.avatar.startsWith('http')
          ? user.avatar
          : `/images/user/${user.avatar}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(`https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=0D8ABC&color=fff&size=200`);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("phone", formData.phone || "");

      if (formData.birthDate && formData.birthDate.trim()) {
        const isoDate = formatDateToInput(formData.birthDate);
        if (isoDate) {
          formDataToSend.append("birthDate", isoDate);
        }
      }

      formDataToSend.append("gender", formData.gender || "");
      formDataToSend.append("roleId", user.role.id.toString());
      formDataToSend.append("accountType", user.accountType);

      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const response = await axios.put(`/api/users/${user.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });

        // Update token if backend returns new token
        if (response.data.token) {
          updateUser(response.data.token);
        }

        setTimeout(() => {
          navigate(0); // Refresh page to show updated info
        }, 1500);
      }
    } catch (error: unknown) {
      console.error("Update error:", error);
      let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message
          || error.response?.data?.errors?.[0]?.message
          || error.message
          || errorMessage;
      }

      setMessage({
        type: "error",
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-white">Vui lòng đăng nhập để xem thông tin tài khoản</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121]">
      <div className="mx-4 md:mx-30 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="text-xs md:text-sm text-gray-400 mb-4 md:mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <span className="mx-1 md:mx-2">›</span>
          <span className="text-white">Vé của tôi</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <UserSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 md:mb-6 lg:mb-8">
              Thông tin tài khoản
            </h1>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              {/* Avatar Section - Compact */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#2dc275]"
                  />
                  <label className="absolute bottom-0 right-0 bg-[#2dc275] rounded-full p-1.5 cursor-pointer hover:bg-[#25a563]">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Cung cấp thông tin chính xác sẽ hỗ trợ bạn trong<br />
                  quá trình mua vé, hoặc khi cần thực hiện vé
                </p>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                  {message.text}
                </div>
              )}

              {/* Form Fields - Compact */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white text-black rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Số điện thoại</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="+84"
                      disabled
                      className="w-16 px-3 py-2.5 bg-gray-700 text-gray-300 rounded text-sm text-center"
                    />
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-white text-black rounded text-sm pr-10"
                        placeholder="Nhập số điện thoại"
                      />
                      {formData.phone && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, phone: "" }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2.5 bg-gray-700 text-gray-300 rounded cursor-not-allowed text-sm pr-10"
                    />
                    {user.accountType === "GOOGLE" && (
                      <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Ngày tháng năm sinh</label>
                  <input
                    type="text"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    className="w-full px-3 py-2.5 bg-white text-black rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Giới tính</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={formData.gender === "Nam"}
                        onChange={() => handleGenderChange("Nam")}
                        className="w-4 h-4 accent-[#2dc275]"
                      />
                      <span className="text-white text-sm">Nam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={formData.gender === "Nữ"}
                        onChange={() => handleGenderChange("Nữ")}
                        className="w-4 h-4 accent-[#2dc275]"
                      />
                      <span className="text-white text-sm">Nữ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Khác"
                        checked={formData.gender === "Khác"}
                        onChange={() => handleGenderChange("Khác")}
                        className="w-4 h-4 accent-[#2dc275]"
                      />
                      <span className="text-white text-sm">Khác</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#2dc275] hover:bg-[#25a563] text-white py-2.5 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Hoàn thành"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
