import React, {useState} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PromotionFilterEmployee from '../../components/Employee/Filter/PromotionFilterEmployee';
import DataTable from '../../components/Common/DataTable/DataTable';
import {getPromotionList, blockPromotion} from '../../api/promotionAPI';
import { useNavigate } from 'react-router-dom';
import { RiResetLeftFill } from "react-icons/ri";


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
        {key: 'promo_name', label: 'Tên khuyến mãi'},
        {key: 'code', label: 'Mã khuyến mãi'},
        {key: 'discount_percentage', label: 'Giảm giá'},
        {key: 'start_date', label: 'Ngày bắt đầu'},
        {key: 'end_date', label: 'Ngày kết thúc'},
        {key: 'max_use', label : "SL còn lại"}
    ]

     // Định nghĩa các hành động (button) cho mỗi cột trong bảng
    const actions = [
        {
        label: 'Khóa',
        variant: 'danger',
        onClick: async (id) => {
            if (window.confirm('Bạn có chắc chắn muốn khóa khuyến mãi này không?')) {
            try {
                await blockPromotion(id);
                setSelectedPromotions((prev) => prev.filter((promoId) => promoId !== id));
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
            // Ensure price fields are properly formatted as strings
            const formattedPromo = {
            ...promoDetail,
            };
            
            navigate("/businessemployee/promotion/addpromotion", {
            state: { promotionDetail: formattedPromo }
            });
        },
        },
    ];


    return (
        <div>
           <Container fluid >
            <Row>
                    <PromotionFilterEmployee
                        selectedItems={selectedPromotions}
                        onSelectChange={setSelectedPromotions}
                    />
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