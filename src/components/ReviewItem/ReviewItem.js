import React from 'react';
import "./ReviewItem.scss"

function ReviewItem(props) {
    const {review} = props
    
    
    return (
        <div className="review-item" key={review.id}>
            <img className="avatar" src={review.avatar} alt={review.name} />
            <div className="review-content">
                <div className="review-info">
                    <span className="name">{review.name}</span>
                    <span className="date">{review.date}</span>
                    
                </div>
                <div><span className="stars">
                    {[1,2,3,4,5].map(i => (
                        <span key={i} className={i <= review.rating ? "star filled" : "star"}>★</span>
                    ))}
                    </span>
                </div>
                <div className="review-text">{review.content}</div>
            </div>
          </div>
    );
}

export default ReviewItem;