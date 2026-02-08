import React, { useState, useMemo } from 'react';
import { useStorage } from './hooks/useStorage';
import { DEFAULT_DATA } from './utils/constants';
import Card from './Card';
import Button from './Button';
import { formatDate } from './utils/helper';

const ReviewsManagement = () => {
  const [data, setData] = useStorage("admin_data_v1", DEFAULT_DATA);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const reviews = data.reviews || [];
  const products = data.products || [];

  // Enhanced reviews with product info
  const enhancedReviews = useMemo(() => {
    return reviews.map(review => {
      const product = products.find(p => p.id === review.productId) || {};
      return {
        ...review,
        productName: product.title || 'Unknown Product',
        productImage: product.images?.[0],
        productCategory: product.category
      };
    });
  }, [reviews, products]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    let filtered = enhancedReviews;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    return filtered;
  }, [enhancedReviews, statusFilter, ratingFilter]);

  // Review statistics
  const reviewStats = useMemo(() => {
    const totalReviews = enhancedReviews.length;
    const pendingReviews = enhancedReviews.filter(r => r.status === 'pending').length;
    const publishedReviews = enhancedReviews.filter(r => r.status === 'published').length;
    const averageRating = enhancedReviews.length > 0 
      ? enhancedReviews.reduce((sum, r) => sum + r.rating, 0) / enhancedReviews.length 
      : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map(stars => ({
      stars,
      count: enhancedReviews.filter(r => r.rating === stars).length,
      percentage: enhancedReviews.length > 0 
        ? (enhancedReviews.filter(r => r.rating === stars).length / enhancedReviews.length) * 100 
        : 0
    }));

    return {
      totalReviews,
      pendingReviews,
      publishedReviews,
      averageRating: averageRating.toFixed(1),
      ratingDistribution
    };
  }, [enhancedReviews]);

  // Update review status
  const updateReviewStatus = (reviewId, status) => {
    setData(prev => ({
      ...prev,
      reviews: prev.reviews.map(r =>
        r.id === reviewId ? { ...r, status } : r
      )
    }));
  };

  // Delete review
  const deleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setData(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r.id !== reviewId)
      }));
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-gray-600 mt-1">
            Manage and moderate customer feedback
          </p>
        </div>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{reviewStats.totalReviews}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{reviewStats.pendingReviews}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{reviewStats.publishedReviews}</div>
          <div className="text-sm text-gray-600">Published</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{reviewStats.averageRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-2">
          {reviewStats.ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="w-16 flex gap-1">
                {renderStars(stars)}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-12 text-sm text-gray-600 text-right">
                {count}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600">
            {statusFilter !== "all" || ratingFilter !== "all" 
              ? "Try adjusting your filters" 
              : "No customer reviews yet"
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={() => updateReviewStatus(review.id, 'published')}
              onReject={() => updateReviewStatus(review.id, 'rejected')}
              onDelete={() => deleteReview(review.id)}
              renderStars={renderStars}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Review Card Component
const ReviewCard = ({ review, onApprove, onReject, onDelete, renderStars }) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Info */}
        <div className="flex items-start gap-4 flex-1">
          <img
            src={review.productImage || "/placeholder-image.jpg"}
            alt={review.productName}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iMzIiIHk9IjMyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhYSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
            }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{review.productName}</h3>
            <div className="text-sm text-gray-600 mb-2">
              {review.productCategory}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-600">({review.rating}/5)</span>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <div className="text-sm text-gray-500">
              By {review.customerName} • {formatDate(review.date)}
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              review.status === 'published' ? 'bg-green-100 text-green-800' :
              review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {review.status}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {review.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  onClick={onApprove}
                  className="flex-1 text-xs"
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={onReject}
                  className="flex-1 text-xs"
                >
                  Reject
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              onClick={onDelete}
              className="flex-1 text-xs"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReviewsManagement;