import React, { useState, useEffect } from "react";
import { CMSReview } from "../../server/admin/reviewsStore";

export const ReviewSection: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [reviews, setReviews] = useState<CMSReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, text: "" });

  useEffect(() => {
    fetch(`/api/reviews/${toolId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReviews(data.reviews);
        setLoading(false);
      });
  }, [toolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/reviews/${toolId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewerName: form.name,
        reviewerEmail: form.email,
        rating: form.rating,
        text: form.text,
      }),
    });
    if (res.ok) {
      alert("Thank you! Your review has been submitted and is awaiting moderation.");
      setForm({ name: "", email: "", rating: 5, text: "" });
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews & Feedback</h2>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 bg-slate-100 rounded">
            <p className="font-bold">{r.reviewerName} - {r.rating} stars</p>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded" required />
        <select value={form.rating} onChange={(e) => setForm({...form, rating: Number(e.target.value)})} className="w-full p-2 border rounded">
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <textarea placeholder="Review" value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Submit Review</button>
      </form>
    </div>
  );
};
