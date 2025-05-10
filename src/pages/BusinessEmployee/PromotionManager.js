import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
function PromotionManager(props) {
    return (
        <div>
           <Container className="promotion-manager">
            <Row>
                    {/* <TourFilterEmployee 
                        onSearch={handleSearch}
                        onSort={handleSort}
                        onDeleteSelected={handleDeleteSelected}
                        selectedItems={selectedTour}
                        searchPlaceholder="Tìm kiếm theo tên hoặc mã tour"
                /> */}
            </Row>

           </Container>
        </div>
    );
}

export default PromotionManager;