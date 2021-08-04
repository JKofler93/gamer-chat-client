import React, {useState} from "react";

function EditReviewForm({ id, rating, content, reviews, setReviews, setIsEditing, isEditing }) {
    const [editContent, setContent] = useState(content)
    const [editRating, setRating] = useState(rating)

    const updateReview = (e) => {
        e.preventDefault()

        const updatedReviewData = {
            content: editContent,
            rating: parseFloat(editRating)
        }

        fetch(`http://localhost:3000/reviews/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                // Accept: "application/json"
            },
            body: JSON.stringify(updatedReviewData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const updatedReviews = reviews.map(review => {
                if (review.id === data.id) {
                    return {...review, content: data.content, rating: data.rating}
                } else {
                    return review
                }
            })
            console.log(updatedReviews)
            setReviews(updatedReviews)
            setIsEditing(!isEditing)
        })

    }

    return (
        <div className="review-form-div">
            <form onSubmit={updateReview} className="review-form">
                <label className="leave-review">Edit your review:</label>
                    <br/>
                    <input 
                        className="review-input"
                        name="content" 
                        value={editContent} 
                        onChange ={event => setContent(event.target.value)}
                    />
                    <br/>
                    <div className="custom-select">
                        <label className="your-rating">Your Rating:</label>
                            <select
                                className="select-selected" 
                                name="rating" 
                                id="rating" 
                                form="review" 
                                value={editRating} 
                                onChange={event => setRating(event.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                        </select>
                    </div>
                <br/>
                <button type="submit" className="submit-btn">Edit Review</button>
            </form>
        </div>
    )
}

export default EditReviewForm;
