import React, { useState } from 'react';
import { Search } from 'lucide-react';
import "../../styles/consultant/Respone.scss";
import { useNavigate } from 'react-router-dom';

function ResponeSupport() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const requestsPerPage = 9;
    const navigate = useNavigate();

    const requests = [
        { id: '#ABC123', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC124', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC125', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC126', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC127', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
        { id: '#ABC128', type: 'Hỗ trợ kỹ thuật', time: '10:00 07/03/2025', content: 'Tới cơ bản thực mạc vé ...' },
    ];

    const fillteredREquests = requests.filter(request =>
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.content.toLowerCase().toLowerCase(searchTerm.toLowerCase())
    );

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);
    const totalPages = Math.ceil(requests.length / requestsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRespond = (requestId) => {
        const cleanId = requestId.replace('#', '');
        console.log('Navigating to:', `/consultantemployee/request-support/${cleanId}`);
        navigate(`/consultantemployee/request-support/${cleanId}`);
    };

    return (
        <div className="support-request-container">
            <div className="support-request-table">
                <h2>Danh sách yêu cầu hỗ trợ</h2>
                <div className="table-header">
                    <span>Chưa phản hồi</span>
                    <span>Đã phản hồi</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Id Khách hàng</th>
                            <th>Loại yêu cầu</th>
                            <th>Thời gian</th>
                            <th>Nội dung</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map((request, index) => (
                            <tr key={index}>
                                <td>
                                    <img src="https://via.placeholder.com/40" alt="Avatar" className="avatar" />
                                    {request.id}
                                </td>
                                <td>{request.type}</td>
                                <td>{request.time}</td>
                                <td>{request.content}</td>
                                <td>
                                    <button
                                        className="respond-btn"
                                        onClick={() => handleRespond(request.id)}
                                    >
                                        Phản hồi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="nav-btn"
                    >
                        <span className="arrow">&lt;</span> Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="nav-btn"
                    >
                        Next <span className="arrow">&gt;</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResponeSupport;