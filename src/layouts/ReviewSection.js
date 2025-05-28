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
  const { tour_id } = props;
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // const filteredReviews = reviews.filter(r =>
  //   r.content.toLowerCase().includes(search.toLowerCase())
  //   && (filter === 'all' || r.rating === Number(filter))
  // );
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewList(tour_id);
        setReviews(response);
        console.log("Fetched reviews: ", response);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
    console.log("reviews: ", reviews);
  }, []);



  return (
    <Container className="review-section">
      <div className="review-header">
       
        <div className="review-score">
          <span className="score">4,12</span>
          <span className="count">(12 đánh giá)</span>
        </div>
        <div className="stars">
          {[1,2,3,4,5].map(i => (
            <span key={i} className={i <= 4 ? "star filled" : "star"}>★</span>
          ))}
        </div>
      </div>
        <ReviewFilter tour_id={tour_id} />

      <div className="review-list">
        {reviews.map(r => (
          <ReviewItem review={r}/>
        ))}
      </div>
      <h5 className="extend-review text-center">Xem thêm nhận xét</h5>


    </Container>
  );
}

export default ReviewSection;