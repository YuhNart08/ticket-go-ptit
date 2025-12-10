import { useEffect, useState, type ReactNode } from 'react';
import { Bell } from "lucide-react";

type DialogType = "leaveBooking" | "timeout" | "continueBooking";

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    ticketType: { type: string };
}

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type: DialogType;
    cartItems?: CartItem[];
    confirmText?: string;
    cancelText?: string;
    countdownEndTime?: number;
    onTimeout?: () => void;
}

const dialogs: Record<DialogType, {
    title: string;
    question: ReactNode;
    details: string[];
    buttonLayout: "confirm-cancel" | "single-confirm" | "continue-cancel";
}> = {
    leaveBooking: {
        title: "Hủy đơn hàng",
        question: "Bạn có chắc chắn muốn tiếp tục?",
        details: [
            "Bạn sẽ mất vị trí mình đã lựa chọn.",
            "Đơn hàng đang trong quá trình thanh toán hoặc đã thanh toán thành công cũng có thể bị huỷ."
        ],
        buttonLayout: "confirm-cancel",
    },
    timeout: {
        title: "Hết thời gian giữ vé",
        question: <><Bell className="w-16 h-16 text-[#2dc275] mx-auto" /><p className="mt-2">Đã hết thời gian giữ vé. Vui lòng đặt lại vé mới.</p></>,
        details: [],
        buttonLayout: "single-confirm",
    },
    continueBooking: {
        title: "Đơn hàng chưa hoàn thành",
        question: "Bạn đang có đơn hàng chưa hoàn tất. Bạn có muốn tiếp tục?",
        details: [],
        buttonLayout: "continue-cancel",
    },
};

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    type,
    cartItems = [],
    confirmText = "Hủy đơn",
    cancelText = "Ở lại",
    countdownEndTime,
    onTimeout,
}: ConfirmationDialogProps) => {
    const [countdownText, setCountdownText] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && type === 'continueBooking' && countdownEndTime) {
            const interval = setInterval(() => {
                const timeLeft = Math.max(0, Math.round((countdownEndTime - Date.now()) / 1000));

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    onTimeout?.();
                    return;
                }

                const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const seconds = (timeLeft % 60).toString().padStart(2, '0');
                setCountdownText(`(${minutes}:${seconds})`);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setCountdownText("");
        }
    }, [isOpen, type, countdownEndTime, onTimeout]);

    const { title, question, details, buttonLayout } = dialogs[type];

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 text-center">
                        <h3 className="font-bold text-xl text-gray-800 mb-3">{title}</h3>
                        <div className="text-gray-600 mb-4">{question}</div>
                        <ul className={`text-gray-600 ${type === 'continueBooking' ? 'text-center' : 'text-left'} list-disc list-inside`}>
                            {type === 'continueBooking' && cartItems.length > 0
                                ? cartItems.map(item => (
                                    <li key={item.id}>{`${item.quantity} x ${item.ticketType.type}`}</li>
                                ))
                                : details.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                        </ul>
                        <div className={buttonLayout == 'continue-cancel' ? "flex flex-col-reverse justify-center items-center gap-4 mt-6" : "flex justify-center items-center gap-4 mt-6"}>
                            {(buttonLayout === "confirm-cancel" || buttonLayout === "continue-cancel") && (
                                <button
                                    onClick={onClose}
                                    className={`flex-1 px-4 py-2.5 rounded-md bg-white text-red-500 border border-red-500 font-semibold hover:bg-red-50 transition-colors ${buttonLayout === 'continue-cancel' ? 'w-full' : ''}`}
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm}
                                className={`flex-1 px-4 py-2.5 rounded-md bg-[#2dc275] text-white font-semibold hover:bg-green-700 transition-colors ${buttonLayout === 'single-confirm' || buttonLayout === 'continue-cancel' ? 'w-full' : ''}`}
                            >
                                {buttonLayout === 'single-confirm' ? "Đặt vé mới" : (buttonLayout === 'continue-cancel' ? `Quay lại đơn cũ ${countdownText}`.trim() : confirmText)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConfirmationDialog;