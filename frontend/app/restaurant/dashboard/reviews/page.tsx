"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { restaurantReviews, restaurantUser } from "@/lib/mock-dashboard-data"
import { Star, MessageSquare, Send, Utensils, Users, Building } from "lucide-react"

type Review = {
  id: string
  customer: string
  avatar: string | null
  rating: number
  food: number
  service: number
  ambiance: number
  comment: string
  date: string
  orderId: string
  reply: string | null
}

export default function RestaurantReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(restaurantReviews as Review[])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  const avgFood = reviews.reduce((acc, r) => acc + r.food, 0) / reviews.length
  const avgService = reviews.reduce((acc, r) => acc + r.service, 0) / reviews.length
  const avgAmbiance = reviews.reduce((acc, r) => acc + r.ambiance, 0) / reviews.length

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, reply: replyText } : r)))
    setReplyText("")
    setReplyingTo(null)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Reviews & Ratings</h2>
          <p className="text-muted-foreground">Customer feedback for {restaurantUser.restaurant.name}</p>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Overall Rating"
          value={avgRating.toFixed(1)}
          description={`Based on ${reviews.length} reviews`}
          icon={<Star className="h-5 w-5" />}
        />
        <StatsCard title="Food Quality" value={avgFood.toFixed(1)} icon={<Utensils className="h-5 w-5" />} />
        <StatsCard title="Service" value={avgService.toFixed(1)} icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Ambiance" value={avgAmbiance.toFixed(1)} icon={<Building className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-navy">{review.customer}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Utensils className="h-3 w-3 text-muted-foreground" />
                    <span>Food: {review.food}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>Service: {review.service}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-muted-foreground" />
                    <span>Ambiance: {review.ambiance}/5</span>
                  </div>
                </div>

                <p className="text-sm">{review.comment}</p>

                {review.reply && (
                  <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                    <p className="text-xs font-medium text-primary mb-1">Restaurant Reply</p>
                    <p className="text-sm">{review.reply}</p>
                  </div>
                )}

                {!review.reply && (
                  <div>
                    {replyingTo === review.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleReply(review.id)}>
                            <Send className="h-4 w-4 mr-1" />
                            Send Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyText("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => setReplyingTo(review.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
