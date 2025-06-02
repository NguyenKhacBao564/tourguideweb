import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PromotionFilterEmployee from '../../components/Employee/Filter/PromotionFilterEmployee';
import DataTable from '../../components/Common/DataTable/DataTable';
import {getPromotionList, blockPromotion, blockBatchPromotion} from '../../api/promotionAPI';
import { useNavigate } from 'react-router-dom';
import { RiResetLeftFill } from "react-icons/ri";


function PromotionManager(props) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPromotions, setSelectedPromotions] = useState([]);
    const [promotions, setPromotions] = useState([]);
    // const [statusFilter, setStatusFilter] = useState(OCCUPANCY_FILTERS.ALL);

    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
    });
    

    // Lấy danh sách khuyến mãi dựa trên bộ lọc
    const fetchPromotions = async () => {
        setIsLoading(true);
        try {
            const queryParams = {};
            if (filters.status !== 'all') {
                queryParams.status = filters.status; // Lọc theo trạng thái khuyến mãi
            }else{
                queryParams.status = 'all'; // Mặc định là lấy khuyến mãi đang hoạt động
            }
            if (filters.search) {
                queryParams.promo_name = filters.search; // Tim kiếm theo tên khuyến mãi
            }
            console.log("Query Params:", queryParams);
            const data = await getPromotionList(queryParams);
            setPromotions(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching promotions:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => { 
    //     const fetchPromotions = async () => {
    //         setIsLoading(true);
    //         try {
    //             const data = await getPromotionList();
    //             setPromotions(data);
    //         } catch (error) {
    //             console.error("Error fetching promotions:", error);
    //             setError(error.message);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchPromotions();
    // }, []);


    // Gọi API khi bộ lọc thay đổi
    useEffect(() => {
        console.log("Filters changed effect run");
        fetchPromotions();
    }, [filters]);

    console.log("filters:", filters);

    const columns = [
        {key: 'promo_id', label: 'Id khuyến mãi'},
        {key: 'promo_name', label: 'Tên khuyến mãi'},
        {key: 'code', label: 'Mã khuyến mãi'},
        {key: 'discount_percentage', label: 'Giảm giá'},
        {key: 'start_date', label: 'Ngày bắt đầu'},
        {key: 'end_date', label: 'Ngày kết thúc'},
        {key: 'max_use', label : "SL còn lại"},
        {key: 'status', label : "Trạng thái"}
    ]

     // Định nghĩa các hành động (button) cho mỗi cột trong bảng
    const actions = [
        {
        label: 'Tạm ngưng',
        variant: 'danger',
        onClick: async (id) => {
            if (window.confirm('Bạn có chắc chắn muốn khóa khuyến mãi này không?')) {
            try {
                await blockPromotion(id);
                setSelectedPromotions((prev) => prev.filter((promoId) => promoId !== id));
                setPromotions((prev) => prev.filter((promo) => promo.promo_id !== id));
                console.log(`Khuyến mãi với ID ${id} đã bị khóa.`);
            } catch (err) {
                console.error('Lỗi khi khóa khuyến mãi:', err);

            }
            }
            console.log("Khóa khuyến mãi");
        },
        },
        {
        label: 'Chi tiết',
        variant: 'success',
        onClick: (id, promoDetail) => {            
            navigate("/businessemployee/promotion/addpromotion", {
            state: { promotionDetail: promoDetail }
            });
        },
        },
    ];


    const handleBlockSelected = async (ids) => {
        if (window.confirm(`Bạn có chắc chắn muốn khóa ${ids.length} khuyến mãi đã chọn không?`)) {
            try {
                await blockBatchPromotion(ids);
                setPromotions((prev) => prev.filter((promo) => !ids.includes(promo.promo_id)));
                setSelectedPromotions([]);
            } catch (error) {
                console.error("Error blocking promotions:", error);
            }
        }
    }

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    return (
        <div>
           <Container fluid >
            <Row>
                    <PromotionFilterEmployee
                        selectedItems={selectedPromotions}
                        onSelectChange={setSelectedPromotions}
                        onBlockSelected={handleBlockSelected}
                        onFilterChange={handleFilterChange}
                        currentFilters={filters}
                    />
            </Row>
            <Row>
                <DataTable
                    data={promotions}
                    columns={columns}
                    actions={actions}
                    isLoading={isLoading}
                    error={error ? error.message : null}
                    itemsPerPage={12}
                    selectedItems={selectedPromotions}
                    onSelectChange={setSelectedPromotions}
                    idKey='promo_id'
                />
            </Row>
           </Container>
        </div>
    );
}

export default PromotionManager;