import React, { useRef, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import TourCardHorizon from '../../components/Common/TourCard/TourCardHorizon';
import "../../styles/pages/FindTourContainer.scss";
import DropDownButton from '../../components/Common/DropDown/DropDownButton';
import { useLocation, Link } from 'react-router-dom';

function ElasticsearchResults(props) {
    const location = useLocation();
    const pageRef = useRef(null);
    console.log("elasticsearch results render")
    
    const [tours, setTours] = useState([]);
    const [originalTours, setOriginalTours] = useState([]);
    const [countResults, setCountResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const searchQuery = location.state?.elasticsearchQuery || '';
    const filterInfo = location.state?.filterInfor || {};
    
    console.log("Elasticsearch search query: ", searchQuery);
    console.log("Filter Information: ", filterInfo);
    console.log("Current state:", { 
        loading, 
        error, 
        toursCount: tours.length, 
        countResults 
    });

    const dropDownItems = [
        { key: "relevance", name: "Độ liên quan" },
        { key: "price_asc", name: "Giá thấp đến cao" },
        { key: "price_desc", name: "Giá cao đến thấp" },
    ]

    const handleSort = (key) => {
        console.log("Sort by: ", key);
        let sortedTours = [...tours];
        
        if (key === "price_asc") {
            sortedTours.sort((a, b) => a.price - b.price);
        } else if (key === "price_desc") {
            sortedTours.sort((a, b) => b.price - a.price);
        } else if (key === "relevance") {
            sortedTours = [...originalTours]; // Khôi phục thứ tự relevance ban đầu
        }
        
        setTours(sortedTours);
    };

    const handleTestAPI = async () => {
        try {
            console.log('🧪 Testing API connection...');
            const testResponse = await fetch('http://localhost:3001/api/elasticsearch/test');
            const testData = await testResponse.json();
            console.log('✅ Test API response:', testData);
            
            console.log('🧪 Testing search API...');
            const searchResponse = await fetch('http://localhost:3001/api/elasticsearch/search?q=tour');
            const searchData = await searchResponse.json();
            console.log('✅ Search API response:', searchData);
            
            alert(`Test thành công! Tours: ${searchData.tours?.length || 0}`);
        } catch (error) {
            console.error('❌ Test API failed:', error);
            alert(`Test thất bại: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!searchQuery.trim()) {
                setError('Không có từ khóa tìm kiếm');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                // Build search parameters
                const params = new URLSearchParams();
                params.append('q', searchQuery);
                
                // Add filters if available
                if (filterInfo.budget && filterInfo.budget !== '') {
                    params.append('budget', filterInfo.budget);
                }
                if (filterInfo.date && filterInfo.date !== '') {
                    params.append('startDate', filterInfo.date);
                }

                const url = `http://localhost:3001/api/elasticsearch/search?${params.toString()}`;
                console.log('🔍 Frontend making request to:', url);
                
                const response = await fetch(url);
                console.log('📡 Response status:', response.status, response.statusText);
                
                const data = await response.json();
                console.log('📦 Response data:', data);
                
                if (response.ok) {
                    console.log('✅ Setting tours state:', data.tours?.length || 0, 'tours');
                    console.log('✅ Setting countResults:', data.pagination?.total || 0);
                    
                    setTours(data.tours || []);
                    setOriginalTours(data.tours || []);
                    setCountResults(data.pagination?.total || 0);
                    
                    console.log('✅ State set successfully');
                } else {
                    throw new Error(data.message || data.error || 'Lỗi tìm kiếm');
                }
            } catch (error) {
                console.error('❌ Error fetching Elasticsearch results:', error);
                console.error('❌ Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
                setError(`Có lỗi xảy ra khi tìm kiếm: ${error.message}`);
                setTours([]);
                setCountResults(0);
            } finally {
                console.log('🏁 Setting loading to false');
                setLoading(false);
                console.log('🏁 Loading state updated');
            }
        };

        console.log('🔄 useEffect triggered with:', { searchQuery, filterInfo });
        fetchData();
    }, [searchQuery, filterInfo.budget, filterInfo.date]); // Use specific properties to avoid object reference issues

    const renderSearchHeader = () => {
        if (loading) return <h2 className="searchText text-center">Đang tìm kiếm...</h2>;
        if (error) return <h2 className="searchText text-center text-danger">{error}</h2>;
        
        return (
            <h2 className="searchText text-center">
                Kết quả tìm kiếm cho: <span className="highlight">"{searchQuery}"</span>
                <div className="mt-2">
                    <small className="text-muted">
                        <span className="badge bg-primary me-2">Elasticsearch</span>
                        Tìm kiếm thông minh với xử lý tiếng Việt
                    </small>
                </div>
            </h2>
        );
    };

    const renderTourResults = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }

        if (error || tours.length === 0) {
            return (
                <div className="text-center py-5">
                    <h4>Không tìm thấy tour phù hợp</h4>
                    <p className="text-muted">
                        {error ? 'Vui lòng thử lại sau.' : 'Hãy thử với từ khóa khác hoặc kiểm tra chính tả.'}
                    </p>
                    <Link to="/findtour" className="btn btn-primary">
                        Tìm kiếm thông thường
                    </Link>
                </div>
            );
        }

        return tours.map((tour, index) => {
            console.log(`🎫 Rendering tour ${index + 1}:`, {
                tour_id: tour.tour_id,
                name: tour.name,
                price: tour.price,
                destination: tour.destination
            });
            
            return (
                <Row key={tour.tour_id || index} style={{ marginBottom: '20px' }}>
                    <TourCardHorizon 
                        tour={tour} 
                        highlight={true} // Có thể thêm highlight cho từ khóa tìm kiếm
                    />
                </Row>
            );
        });
    };

    console.log("ElasticsearchResults component rendered");
    
    // Debug render states
    if (loading) {
        console.log("🔄 Component rendering in LOADING state");
    } else if (error) {
        console.log("❌ Component rendering in ERROR state:", error);
    } else if (tours.length === 0) {
        console.log("📭 Component rendering with NO TOURS");
    } else {
        console.log("✅ Component rendering with", tours.length, "tours");
    }
    
    return (
        <div className="findTour_Page" ref={pageRef}>
            <NavBar pageRef={pageRef} />
            <Container className="findTour_Container">
                <Row className="mb-5">
                    <Link to="/">Trở về trang chủ</Link>
                </Row>
                
                <Row className="mb-5">
                    {renderSearchHeader()}
                </Row>

                <Row className="mb-3 fw-bold">
                    <Col md={3} className="fz-18">
                        <div className="d-flex align-items-center">
                            TÌM KIẾM ELASTICSEARCH
                            <span className="badge bg-success ms-2 fs-6">AI</span>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-between align-items-center" md={9}>
                        <h2>
                            {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${countResults} tour`}
                        </h2>
                        {!loading && !error && tours.length > 0 && (
                            <div className="sort_Area d-flex align-items-center">
                                <p className="sort-text mb-0 me-2">Sắp xếp theo:</p>
                                <DropDownButton 
                                    onChange={handleSort} 
                                    className="dropDown_Sort" 
                                    title="Độ liên quan" 
                                    dropitem={dropDownItems} 
                                />
                            </div>
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col md={3}>
                        <div className="elasticsearch-info p-3 bg-light rounded">
                            <h5 className="text-primary">
                                <i className="fas fa-search me-2"></i>
                                Tìm kiếm thông minh
                            </h5>
                            <ul className="list-unstyled small text-muted">
                                <li>✓ Xử lý tiếng Việt có dấu</li>
                                <li>✓ Tìm kiếm mờ (fuzzy search)</li>
                                <li>✓ Đồng nghĩa (Hà Nội = Thủ đô)</li>
                                <li>✓ Tìm kiếm theo ngữ cảnh</li>
                                <li>✓ Xếp hạng theo độ liên quan</li>
                            </ul>
                            
                            {searchQuery && (
                                <div className="mt-3">
                                    <strong>Từ khóa:</strong>
                                    <div className="badge bg-primary mt-1">{searchQuery}</div>
                                </div>
                            )}
                            
                            {filterInfo.budget && (
                                <div className="mt-2">
                                    <strong>Ngân sách:</strong>
                                    <div className="badge bg-success mt-1">{filterInfo.budget}</div>
                                </div>
                            )}
                            
                            {filterInfo.date && (
                                <div className="mt-2">
                                    <strong>Ngày đi:</strong>
                                    <div className="badge bg-info mt-1">{filterInfo.date}</div>
                                </div>
                            )}
                            
                            {/* Debug button */}
                            <div className="mt-3">
                                <button 
                                    className="btn btn-sm btn-warning" 
                                    onClick={handleTestAPI}
                                >
                                    🧪 Test API
                                </button>
                            </div>
                        </div>
                    </Col>
                    
                    <Col md={9} className="filterTour_List">
                        {renderTourResults()}
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default ElasticsearchResults; 