import React, { useState, useEffect } from "react";
import { CMSReview, fetchReviews, updateReviewStatus, deleteReview } from "../../server/admin/reviewsStore";

export const ReviewManagementSection: React.FC = () => {
  const [reviews, setReviews] = useState<CMSReview[]>([]);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

  const handleStatusChange = async (id: string, status: CMSReview["status"]) => {
    await fetch(`/api/admin/reviews/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchReviews().then(setReviews);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reviews Management</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Reviewer</th>
            <th>Tool ID</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.reviewerName}</td>
              <td>{r.toolId}</td>
              <td>{r.rating}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => handleStatusChange(r.id, "approved")}>Approve</button>
                <button onClick={() => handleStatusChange(r.id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
