import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowLeft, Send } from 'lucide-react';
import "../../styles/consultant/ResponeDetail.scss";

const CustomerInfoItem = ({ icon, text }) => {
    return (
        <div className="customer-info-item">
            <div className="customer-info-icon">{icon}</div>
            <span>{text}</span>
        </div>
    );
};

const ResponeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [response, setResponse] = useState("");

    const requestData = {
        'ABC123': {
            id: 'ABC123',
            type: 'Hỗ trợ kỹ thuật',
            time: '10:00 07/03/2025',
            content: 'Tới cơ bản thực mạc vé ...',
            customerName: 'Nguyen Khac Bao',
            phone: '0919022299',
            email: 'NguyenKhacBao123@gmail.com',
            joinDate: '17/03/2025',
        }
    };

    useEffect(() => {
        const requestDetails = requestData[id];
        if (requestDetails) {
            setRequest(requestDetails);
        } else {
            navigate('/consultantemployee');
        }
    }, [id, navigate, requestData]);

    const handleResponseChange = (e) => {
        setResponse(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Xử lý gửi phản hồi
        console.log('Phản hồi:', response);
    };

    if (!request) {
        return <div>Loading...</div>;
    }

    return (
        <div className="support-container">
            <div className="support-content">
                <div className="mb-6">
                    <button className="back-button" onClick={() => navigate('/consultantemployee/support-request')}>
                        <ArrowLeft className="back-icon" />
                        <span>Quay lại</span>
                    </button>
                </div>

                <div className="customer-card">
                    <h2 className="customer-title">
                        Thông tin khách hàng yêu cầu hỗ trợ
                    </h2>

                    <div className="customer-grid">
                        <div className="customer-info-space">
                            <CustomerInfoItem
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M18 20a6 6 0 0 0-12 0" />
                                        <circle cx="12" cy="10" r="4" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                }
                                text={request.customerName}
                            />
                            <CustomerInfoItem
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                }
                                text={request.email}
                            />
                        </div>
                        <div className="customer-info-space">
                            <CustomerInfoItem
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                }
                                text={request.phone}
                            />
                            <CustomerInfoItem
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                }
                                text={request.joinDate}
                            />
                        </div>
                    </div>

                    <div className="customer-details">
                        <div>
                            <p className="customer-id-label">Id khách hàng:</p>
                            <p className="customer-id-value">#{request.id}</p>
                        </div>
                        <div>
                            <p className="customer-id-label">Chủ đề:</p>
                            <p>{request.type}</p>
                        </div>
                    </div>
                </div>

                <div className="support-section">
                    <h3 className="support-label">Nội dung yêu cầu:</h3>
                    <div className="support-content-box">
                        <p className="support-content-text">
                            {request.content}
                        </p>
                    </div>
                </div>

                <div className="response-card">
                    <div className="editor-toolbar">
                        <button className="toolbar-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                                <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9" />
                                <path d="m8 15-1.5 3 3-1.5" />
                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                <path d="M5.5 12.5 7 14l2-2" />
                                <path d="M7 14l-1 1" />
                            </svg>
                        </button>
                        <button className="toolbar-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </button>
                        <button className="toolbar-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                            </svg>
                        </button>
                        <button className="toolbar-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                                <line x1="19" y1="5" x2="5" y2="19" />
                                <circle cx="6.5" cy="6.5" r="2.5" />
                                <circle cx="17.5" cy="17.5" r="2.5" />
                            </svg>
                        </button>
                        <div className="font-dropdown">
                            <button className="dropdown-button">
                                <span>Font Family</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <button className="toolbar-button ml-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
                            </svg>
                        </button>
                        <button className="toolbar-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>
                        </button>
                    </div>

                    <div className="response-text">
                        <textarea
                            value={response}
                            onChange={handleResponseChange}
                            placeholder="Nhập phản hồi của bạn..."
                            rows="10"
                        />
                    </div>

                    <div className="response-actions">
                        <button className="send-button" onClick={handleSubmit}>
                            <Send className="send-icon" />
                            Gửi
                        </button>
                    </div>
                </div>
            </div>
        </div>
        //     <div className="profile-page">
        //         <div className="page-header">
        //             <h2>THÔNG TIN KHÁCH HÀNG YÊU CẦU HỖ TRỢ</h2>
        //             <button className="logout-button" onClick={() => navigate('/consultantemployee/request-support')}>
        //                 Quay lại
        //             </button>
        //         </div>

        //         <div className="profile-card">
        //             <div className="profile-content">
        //                 <div className="profile-section">
        //                     <h4>Thông tin khách hàng</h4>
        //                     <div className="customer-details">
        //                         <div className="avatar-wrapper">
        //                             <img src="https://via.placeholder.com/40" alt="Avatar" className="avatar" />
        //                         </div>
        //                         <div className="info">
        //                             <div className="input-group">
        //                                 <label>Họ và tên</label>
        //                                 <input type="text" defaultValue={request.customerName} readOnly />
        //                             </div>
        //                             <div className="input-group">
        //                                 <label>Số điện thoại</label>
        //                                 <div className="input-with-icon">
        //                                     <span className="input-icon"><Phone size={16} /></span>
        //                                     <input type="tel" defaultValue={request.phone} readOnly />
        //                                 </div>
        //                             </div>
        //                             <div className="input-group">
        //                                 <label>Email</label>
        //                                 <div className="input-with-icon">
        //                                     <span className="input-icon"><Mail size={16} /></span>
        //                                     <input type="email" defaultValue={request.email} readOnly />
        //                                 </div>
        //                             </div>
        //                             <div className="input-group">
        //                                 <label>Ngày tham gia</label>
        //                                 <input type="text" defaultValue={request.joinDate} readOnly />
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //                 <div className="profile-section">
        //                     <h4>Thông tin yêu cầu</h4>
        //                     <div className="input-group">
        //                         <label>Id khách hàng</label>
        //                         <input type="text" defaultValue={request.id} readOnly />
        //                     </div>
        //                     <div className="input-group">
        //                         <label>Chủ đề</label>
        //                         <input type="text" defaultValue={request.type} readOnly />
        //                     </div>
        //                     <div className="input-group">
        //                         <label>Nội dung yêu cầu</label>
        //                         <textarea defaultValue={request.content} rows="3" readOnly />
        //                     </div>
        //                 </div>

        //                 <div className="profile-section">
        //                     <h4>Phản hồi</h4>
        //                     <div className="editor-toolbar">
        //                         <button><strong>B</strong></button>
        //                         <button><em>I</em></button>
        //                         <button><u>U</u></button>
        //                         <button>🔗</button>
        //                         <select defaultValue="Font Family">
        //                             <option>Font Family</option>
        //                             <option>Arial</option>
        //                             <option>Times New Roman</option>
        //                         </select>
        //                         <button>❝</button>
        //                         <button>…</button>
        //                     </div>
        //                     <textarea
        //                         placeholder="Nhập phản hồi của bạn..."
        //                         rows="5"
        //                     ></textarea>
        //                 </div>
        //             </div>

        //             <div className="profile-actions">
        //                 <button className="save-button">Gửi phản hồi</button>
        //             </div>
        //         </div>
        //     </div>
    );
};

export default ResponeDetail;