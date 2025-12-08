"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ThumbsUp, MessageSquare, Edit, Trash2 } from "lucide-react"

const customerReviews = [
  {
    id: "1",
    restaurant: "The Spice Garden",
    restaurantImage: "/indian-restaurant-logo.png",
    date: "Dec 18, 2024",
    rating: 5,
    foodRating: 5,
    serviceRating: 4,
    ambienceRating: 5,
    comment:
      "Absolutely loved the butter chicken and garlic naan! The flavors were authentic and the portion sizes were generous. Will definitely come back.",
    images: [],
    helpful: 12,
    reply: {
      text: "Thank you so much for your kind words! We're delighted you enjoyed the butter chicken. Looking forward to serving you again!",
      date: "Dec 19, 2024",
    },
  },
  {
    id: "2",
    restaurant: "Sushi Master",
    restaurantImage: "/japanese-restaurant-logo.jpg",
    date: "Dec 10, 2024",
    rating: 4,
    foodRating: 5,
    serviceRating: 4,
    ambienceRating: 3,
    comment:
      "Fresh sushi and great presentation. The salmon nigiri was excellent. Service was good but the restaurant was a bit crowded.",
    images: [],
    helpful: 8,
    reply: null,
  },
  {
    id: "3",
    restaurant: "Pizza Paradise",
    restaurantImage: "/pizza-restaurant-logo.png",
    date: "Nov 25, 2024",
    rating: 3,
    foodRating: 4,
    serviceRating: 2,
    ambienceRating: 3,
    comment:
      "Pizza was good but took longer than expected. The crust was crispy and toppings were fresh. Service needs improvement.",
    images: [],
    helpful: 5,
    reply: {
      text: "We apologize for the delay. We've addressed this with our team and are working to improve our service times. Thank you for your feedback!",
      date: "Nov 26, 2024",
    },
  },
]

export default function CustomerReviewsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">My Reviews</h2>
        <p className="text-muted-foreground">Reviews you have written for restaurants</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-navy">{customerReviews.length}</p>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-navy">4.0</p>
            <p className="text-sm text-muted-foreground">Average Rating Given</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-navy">25</p>
            <p className="text-sm text-muted-foreground">Helpful Votes Received</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="replied">With Replies</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {customerReviews
              .filter((r) => activeTab === "all" || (activeTab === "replied" && r.reply))
              .map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.restaurantImage || "/placeholder.svg"}
                        alt={review.restaurant}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-navy">{review.restaurant}</h3>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 font-medium">{review.rating}.0</span>
                        </div>

                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Food: <span className="text-foreground">{review.foodRating}/5</span>
                          </span>
                          <span className="text-muted-foreground">
                            Service: <span className="text-foreground">{review.serviceRating}/5</span>
                          </span>
                          <span className="text-muted-foreground">
                            Ambience: <span className="text-foreground">{review.ambienceRating}/5</span>
                          </span>
                        </div>

                        <p className="text-muted-foreground">{review.comment}</p>

                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="h-4 w-4" />
                            {review.helpful} found helpful
                          </button>
                        </div>

                        {review.reply && (
                          <div className="bg-muted/50 rounded-lg p-4 mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">Restaurant Reply</span>
                              <span className="text-xs text-muted-foreground">{review.reply.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.reply.text}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {customerReviews.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">You have not written any reviews yet</p>
            <Button>Write Your First Review</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
