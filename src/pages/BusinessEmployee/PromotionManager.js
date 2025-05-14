import React, {useState} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PromotionFilterEmployee from '../../components/Employee/Filter/PromotionFilterEmployee';
import DataTable from '../../components/Common/DataTable/DataTable';
import {getPromotionList} from '../../api/promotionAPI';
import { useNavigate } from 'react-router-dom';



function PromotionManager(props) {
    const navigate = useNavigate();
    const [selectedPromotions, setSelectedPromotions] = useState([]);
    const [promotions, setPromotions] = React.useState([]);

    React.useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const data = await getPromotionList();
                setPromotions(data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            }
        };
        fetchPromotions();
    }, []);

    const columns = [
        {key: 'promo_id', label: 'Id khuyến mãi'},
        {key: 'description', label: 'Tên khuyến mãi'},
        {key: 'code', label: 'Mã khuyến mãi'},
        {key: 'discount_percentage', label: 'Giảm giá'},
        {key: 'start_date', label: 'Ngày bắt đầu'},
        {key: 'max_use', label : "SL còn lại"}
    ]

     // Định nghĩa các hành động (button) cho mỗi cột trong bảng
    const actions = [
        {
        label: 'Khóa',
        variant: 'danger',
        onClick: async (id) => {
            // if (window.confirm('Bạn có chắc chắn muốn khóa tour này không?')) {
            // try {
            //     await blockTour(id);
            //     setSelectedTour((prev) => prev.filter((tourId) => tourId !== id));
            // } catch (err) {
            //     console.error('Lỗi khi khóa tour:', err);
            // }
            // }
            console.log("Khóa tour");
        },
        },
        {
        label: 'Chi tiết',
        variant: 'success',
        onClick: (id, tourDetail) => {
            // Ensure price fields are properly formatted as strings
            const formattedTour = {
            ...tourDetail,
            };
            
            navigate("/businessemployee/promotion/addpromotion", {
            state: { tourDetail: formattedTour }
            });
        },
        },
    ];


    return (
        <div>
           <Container fluid >
            <Row>
                    <PromotionFilterEmployee/>
            </Row>
            <Row>
                <DataTable
                    data={promotions}
                    columns={columns}
                    actions={actions}
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