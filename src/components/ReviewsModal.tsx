
import React, { useState } from 'react';
import { Garage, Review } from '@/models/garage';
import { Button } from '@/components/ui/button';
import { Star, X, ThumbsUp } from 'lucide-react';
import { submitReview } from '@/services/garageService';
import { useToast } from '@/components/ui/use-toast';

interface ReviewsModalProps {
  garage: Garage;
  onClose: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({ garage, onClose }) => {
  const { toast } = useToast();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    userName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };
  
  const handleSubmitReview = async () => {
    if (!newReview.userName || !newReview.comment) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide your name and a comment to submit a review.",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitReview(garage.id, {
        userId: 'guest',
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      
      setIsAddingReview(false);
      setNewReview({ rating: 5, comment: '', userName: '' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 bg-teal-500 text-white relative flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Reviews & Ratings</h2>
            <p className="text-teal-50">{garage.name}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  size={16}
                  className={`${i < Math.floor(garage.rating) ? 'text-yellow-300' : 'text-white/30'}`}
                  fill={i < Math.floor(garage.rating) ? '#facc15' : 'none'}
                />
              ))}
              <span className="ml-1 font-medium">{garage.rating.toFixed(1)}</span>
            </div>
            
            <button 
              className="text-white hover:bg-teal-600 rounded-full p-1"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-5 overflow-y-auto flex-grow">
          {!isAddingReview ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-medium">{garage.reviews.length} Customer Reviews</h3>
                <Button 
                  size="sm"
                  onClick={() => setIsAddingReview(true)}
                >
                  Write a Review
                </Button>
              </div>
              
              <div className="space-y-4">
                {garage.reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No reviews yet. Be the first to leave a review!
                  </p>
                ) : (
                  garage.reviews
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map(review => (
                      <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{review.userName}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  size={14}
                                  className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill={i < review.rating ? '#facc15' : 'none'}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-700">
                          {review.comment}
                        </p>
                        
                        {review.serviceUsed && (
                          <div className="mt-2 text-xs bg-teal-50 text-teal-800 py-1 px-2 rounded-full inline-block">
                            Service: {review.serviceUsed}
                          </div>
                        )}
                        
                        <div className="mt-3 flex justify-end">
                          <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700">
                            <ThumbsUp size={12} />
                            <span>Helpful</span>
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-medium mb-4">Write a Review</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    name="userName"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newReview.userName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating:
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className="p-1"
                        onClick={() => handleRatingChange(rating)}
                      >
                        <Star
                          size={24}
                          className={`${rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill={rating <= newReview.rating ? '#facc15' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review:
                  </label>
                  <textarea
                    name="comment"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newReview.comment}
                    onChange={handleInputChange}
                    placeholder="Share your experience with this garage"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingReview(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
