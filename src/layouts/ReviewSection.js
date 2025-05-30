import React, { useEffect, useState } from 'react';
import '../styles/layouts/ReviewSection.scss';
import Container from 'react-bootstrap/Container';
import ReviewFilter from '../components/ReviewFilter/ReviewFilter';
import ReviewItem from '../components/ReviewItem/ReviewItem';
import { getReviewList } from '../api/reviewAPI';


// const reviews = [
//   {
//     id: 1,
//     name: "Nguyễn Khắc Bảo",
//     date: "11/03/2025",
//     avatar: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/avartar-anime-35.jpg",
//     rating: 5,
//     content: "Trải nghiệm tuyệt vời tại Đà Lạt! ...",
//   },
//   {
//     id: 2,
//     name: "Trần Quốc Bảo",
//     date: "2/09/2024",
//     avatar: "https://gamek.mediacdn.vn/133514250583805952/2024/10/2/image-10-1024x576-1727854663787258839106-1727863657755-1727863657841193857596.png",
//     rating: 5,
//     content: "Dịch vụ tốt, phong cảnh đẹp, đáng để trải nghiệm ...",
//   },
//   // Thêm các review khác...
// ];

function ReviewSection(props) {
  const { tour_id, num_reviews, avg_rating } = props;
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn bình luận để tải không
  const [page, setPage] = useState(1); //Các đánh giá sẽ được phân trang, mỗi trang sẽ hiển thị 5 đánh giá

  const limit = 5; // Số lượng đánh giá mỗi trang
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewList(tour_id, page, limit);
        setReviews(prev => page === 1 ? response : [...prev, ...response]);
        setHasMore(response.length === limit);
        console.log("Fetched reviews: ", response);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
    console.log("reviews: ", reviews);
  }, [tour_id, page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1); // Tăng trang để tải thêm bình luận
  };

  return (
    <Container className="review-section">
      <div className="review-header">
       
        <div className="review-score">
          <span className="score">{avg_rating}</span>
          <span className="count">({num_reviews} đánh giá)</span>
        </div>
        <div className="stars">
          {[1,2,3,4,5].map(i => (
            <span key={i} className={i <= avg_rating ? "star filled" : "star"}>★</span>
          ))}
        </div>
      </div>
        <ReviewFilter tour_id={tour_id} />

      <div className="review-list">
        {reviews.map(r => (
          <ReviewItem key={r.review_id} review={r}/>
        ))}
      </div>
      {hasMore && (
        <h5 className="extend-review text-center" onClick={handleLoadMore}>
          Xem thêm nhận xét
        </h5>
      )}


    </Container>
  );
}

export default ReviewSection;