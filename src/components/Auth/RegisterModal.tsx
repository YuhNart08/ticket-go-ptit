import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { RegisterCredentials } from '../../constants/types/types';
import axios from 'axios';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isSubmitting, onClose]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
  
    if (!formData.fullName || formData.fullName.trim() === '') {
      setErrors({ fullName: 'Họ và tên không được để trống' });
      return;
    }

    if (!formData.email || formData.email.trim() === '') {
      setErrors({ email: 'Email không được để trống' });
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrors({ password: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await axios.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            fullName: ''
          });
          setErrors({});
          onSwitchToLogin();
        }, 1500);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        err.response.data.errors.forEach((error: any) => {
          if (error.path === "fullName") backendErrors.fullName = error.message;
          else if (error.path === "email") backendErrors.email = error.message;
          else if (error.path === "phone") backendErrors.phone = error.message;
          else if (error.path === "password") backendErrors.password = error.message;
          else if (error.path === "confirmPassword") backendErrors.confirmPassword = error.message;
        });
        setErrors(backendErrors);
      } else {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

return (
  <div 
    ref={modalRef}
    className="bg-white rounded-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto"
  >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto"
      >
  {/* Tiêu đề */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <h2 id="register-modal-title" className="text-white text-2xl font-bold">Đăng ký</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-full hover:bg-white/10"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

  {/* Biểu mẫu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
          {/* Thông báo thành công */}
          {showSuccess && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Đăng ký thành công!</span>
            </div>
          )}

          {/* Ô nhập họ tên */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.fullName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              disabled={isSubmitting}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <div id="fullName-error" className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Ô nhập email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <div id="email-error" className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Ô nhập số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-gray-400 text-xs">(Tùy chọn)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="0912345678"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <div id="phone-error" className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Ô nhập mật khẩu */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu của bạn"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-12 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                }`}
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <div id="password-error" className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Ô nhập xác nhận mật khẩu */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-12 ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                }`}
                disabled={isSubmitting}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1"
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div id="confirmPassword-error" className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            disabled={isSubmitting || showSuccess}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? 'Đang xử lý...' : showSuccess ? 'Thành công!' : 'Đăng ký'}
          </button>

          {/* Trạng thái tải */}
          {isSubmitting && (
            <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <div className="animate-spin w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
              <span className="font-medium">Đang tạo tài khoản...</span>
            </div>
          )}

          {/* Liên kết đăng nhập */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={isSubmitting}
              className="text-green-600 font-semibold hover:text-green-700 transition-colors hover:underline disabled:opacity-50 text-sm"
            >
              Đăng nhập ngay
            </button>
          </div>

          {/* Điều khoản và chính sách */}
          <div className="text-xs text-gray-500 text-center leading-relaxed pt-2">
            Bằng việc đăng ký, bạn đã đọc và đồng ý với{' '}
            <a href="#" className="text-green-600 hover:underline font-medium" tabIndex={isSubmitting ? -1 : 0}>
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-green-600 hover:underline font-medium" tabIndex={isSubmitting ? -1 : 0}>
              Chính sách bảo mật
            </a>{' '}
            của Ticketbox
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
