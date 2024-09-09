"use server";

import { db } from "@/db";

export async function getMaxVote(id) {
  const res = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
      COALESCE(SUM(votes.vote), 0) AS vote_total
       FROM posts
       JOIN users ON posts.user_id = users.id
       LEFT JOIN votes ON votes.post_id = posts.id
       WHERE posts.user_id=$1
       GROUP BY posts.id, users.name
       ORDER BY vote_total DESC`,
    [id]
  );

  const userPostsVote = res.rows;

  const votes = [];
  userPostsVote.map((post) => {
    votes.push(post.vote_total);
  });
  const numberArray = votes.map((str) => Number(str));
  const maxNumber = Math.max(...numberArray);
  console.log("insode action:", maxNumber);
  return maxNumber;
}
